/**
 * One-time backfill: copies existing Firestore data for every module
 * already migrated to Postgres (Users, Roles, Master Data, Management
 * categories/statuses, Notifications, Settings, Bugs + comments, Projects,
 * Leads, Customers + contacts/documents/messages/invoices) into the
 * corresponding Postgres tables. Safe to re-run — every write is
 * an upsert keyed by id, and ids
 * are preserved from the original Firestore doc ids so the app's existing
 * dual-write (API + Firestore mirror) logic stays consistent afterwards.
 *
 * Requires Firestore rules to allow reads for these collections (public
 * read, per the current rules) — no Firebase credentials needed.
 *
 * Run with: npx ts-node -r tsconfig-paths/register scripts/backfill-from-firestore.ts
 */
import 'dotenv/config';
import { DataSource } from 'typeorm';
import { initializeApp } from 'firebase/app';
import { collection, doc, getDoc, getDocs, getFirestore } from 'firebase/firestore';

import { User } from '../src/users/user.entity';
import { Role } from '../src/roles/role.entity';
import {
  MASTER_DATA_TYPES,
  MasterDataItem,
} from '../src/master-data/master-data-item.entity';
import {
  MANAGEMENT_ITEM_TYPES,
  ManagementItem,
} from '../src/management/management-item.entity';
import { Notification } from '../src/notifications/notification.entity';
import { Setting, SETTING_KEYS } from '../src/settings/setting.entity';
import { Bug } from '../src/bugs/bug.entity';
import { BugComment } from '../src/bugs/bug-comment.entity';
import { Project } from '../src/projects/project.entity';
import { Lead } from '../src/leads/lead.entity';
import { Customer } from '../src/customers/customer.entity';
import { CustomerContact } from '../src/customers/customer-contact.entity';
import { CustomerDocument } from '../src/customers/customer-document.entity';
import { CustomerMessage } from '../src/customers/customer-message.entity';
import { CustomerInvoice } from '../src/customers/customer-invoice.entity';

function toDate(val: unknown): Date {
  if (!val) return new Date();
  if (typeof (val as { toDate?: () => Date }).toDate === 'function') {
    return (val as { toDate: () => Date }).toDate();
  }
  return new Date(val as string | number);
}

async function main() {
  const firebaseApp = initializeApp({
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  });
  const firestore = getFirestore(firebaseApp);

  const dataSource = new DataSource({
    type: 'postgres',
    url: process.env.POSTGRES_DB_URL,
    ssl: true,
    entities: [
      User,
      Role,
      MasterDataItem,
      ManagementItem,
      Notification,
      Setting,
      Bug,
      BugComment,
      Project,
      Lead,
      Customer,
      CustomerContact,
      CustomerDocument,
      CustomerMessage,
      CustomerInvoice,
    ],
  });
  await dataSource.initialize();
  console.log('Connected to Postgres.\n');

  // ── Users ──
  const usersSnap = await getDocs(collection(firestore, 'users'));
  const users = usersSnap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      email: data.email || '',
      name: data.name || data.displayName || '',
      photoUrl: data.photoURL || undefined,
      role: data.role || 'user',
      jobRole: data.jobRole || undefined,
      approved: data.approved ?? false,
      createdAt: toDate(data.createdAt),
      lastLoginAt: data.lastLoginAt ? toDate(data.lastLoginAt) : undefined,
      updatedAt: data.updatedAt ? toDate(data.updatedAt) : undefined,
    };
  });
  if (users.length) await dataSource.getRepository(User).upsert(users, ['id']);
  console.log(`Users: ${users.length}`);

  // ── Roles (management/roles/items) ──
  const rolesSnap = await getDocs(
    collection(firestore, 'management', 'roles', 'items'),
  );
  const roles = rolesSnap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      name: data.name || '',
      permissions: Array.isArray(data.permissions)
        ? data.permissions
        : undefined,
      createdAt: toDate(data.createdAt),
      updatedAt: toDate(data.updatedAt ?? data.createdAt),
    };
  });
  if (roles.length) await dataSource.getRepository(Role).upsert(roles, ['id']);
  console.log(`Roles: ${roles.length}`);

  // ── Master data (industry, leadSource, country, currency, workCategory) ──
  let masterDataTotal = 0;
  for (const type of MASTER_DATA_TYPES) {
    const snap = await getDocs(collection(firestore, type));
    const items = snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        type,
        code: data.code || '',
        label: data.label || '',
        sortOrder: data.sortOrder ?? 0,
        status: data.status || 'active',
        isdCode: data.isdCode || undefined,
        timezone: data.timezone || undefined,
        createdAt: toDate(data.createdAt),
        updatedAt: toDate(data.updatedAt ?? data.createdAt),
      };
    });
    if (items.length) {
      await dataSource.getRepository(MasterDataItem).upsert(items, ['id']);
    }
    console.log(`Master data (${type}): ${items.length}`);
    masterDataTotal += items.length;
  }

  // ── Management categories/statuses ──
  let managementTotal = 0;
  for (const type of MANAGEMENT_ITEM_TYPES) {
    const snap = await getDocs(
      collection(firestore, 'management', type, 'items'),
    );
    const items = snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        type,
        name: data.name || '',
        createdAt: toDate(data.createdAt),
        updatedAt: toDate(data.updatedAt ?? data.createdAt),
      };
    });
    if (items.length) {
      await dataSource.getRepository(ManagementItem).upsert(items, ['id']);
    }
    console.log(`Management (${type}): ${items.length}`);
    managementTotal += items.length;
  }

  // ── Notifications ──
  const notificationsSnap = await getDocs(collection(firestore, 'notifications'));
  const notifications = notificationsSnap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      userId: data.userId,
      type: data.type,
      title: data.title,
      message: data.message,
      link: data.link || undefined,
      read: data.read ?? false,
      entityType: data.entityType || undefined,
      entityId: data.entityId || undefined,
      actorName: data.actorName || undefined,
      createdAt: toDate(data.createdAt),
    };
  });
  if (notifications.length) {
    await dataSource.getRepository(Notification).upsert(notifications, ['id']);
  }
  console.log(`Notifications: ${notifications.length}`);

  // ── Settings (billing, bank — singleton docs) ──
  let settingsTotal = 0;
  for (const key of SETTING_KEYS) {
    const snap = await getDoc(doc(firestore, 'settings', key));
    if (snap.exists()) {
      await dataSource
        .getRepository(Setting)
        .upsert({ key, data: snap.data() }, ['key']);
      settingsTotal += 1;
    }
    console.log(`Settings (${key}): ${snap.exists() ? 1 : 0}`);
  }

  // ── Bugs ──
  const bugsSnap = await getDocs(collection(firestore, 'bugs'));
  const bugs = bugsSnap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      code: data.code || undefined,
      seq: data.seq ?? 0,
      title: data.title || '',
      description: data.description || '',
      bugStatus: data.bugStatus || 'open',
      priority: data.priority || 'medium',
      severity: data.severity || 'minor',
      type: data.type || 'bug',
      projectId: data.projectId || undefined,
      projectName: data.projectName || undefined,
      assignee: data.assignee || undefined,
      reporter: data.reporter || undefined,
      stepsToReproduce: data.stepsToReproduce || undefined,
      expectedBehavior: data.expectedBehavior || undefined,
      actualBehavior: data.actualBehavior || undefined,
      tags: Array.isArray(data.tags) ? data.tags : [],
      attachments: Array.isArray(data.attachments) ? data.attachments : undefined,
      createdBy: data.createdBy || undefined,
      createdAt: toDate(data.createdAt),
      updatedAt: toDate(data.updatedAt ?? data.createdAt),
    };
  });
  if (bugs.length) await dataSource.getRepository(Bug).upsert(bugs, ['id']);
  console.log(`Bugs: ${bugs.length}`);

  // ── Bug comments (bugs/{bugId}/comments subcollection) ──
  let commentsTotal = 0;
  for (const bugDoc of bugsSnap.docs) {
    const commentsSnap = await getDocs(
      collection(firestore, 'bugs', bugDoc.id, 'comments'),
    );
    const comments = commentsSnap.docs.map((c) => {
      const data = c.data();
      return {
        id: c.id,
        bugId: bugDoc.id,
        text: data.text || '',
        authorId: data.authorId || '',
        authorName: data.authorName || '',
        mentions: Array.isArray(data.mentions) ? data.mentions : undefined,
        createdAt: toDate(data.createdAt),
      };
    });
    if (comments.length) {
      await dataSource.getRepository(BugComment).upsert(comments, ['id']);
    }
    commentsTotal += comments.length;
  }
  console.log(`Bug comments: ${commentsTotal}`);

  // ── Projects ──
  const projectsSnap = await getDocs(collection(firestore, 'projects'));
  const projects = projectsSnap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      seq: data.seq ?? 0,
      name: data.name || '',
      description: data.description || '',
      customerId: data.customerId || '',
      customerName: data.customerName || undefined,
      projectStatus: data.projectStatus || 'planning',
      priority: data.priority || 'medium',
      category: data.category || '',
      code: data.code || undefined,
      sowCount: data.sowCount ?? undefined,
      tags: Array.isArray(data.tags) ? data.tags : [],
      startDate: toDate(data.startDate),
      endDate: data.endDate ? toDate(data.endDate) : undefined,
      budget: data.budget ?? undefined,
      logoUrl: data.logoUrl || undefined,
      teamLead: data.teamLead || undefined,
      createdBy: data.createdBy || undefined,
      createdAt: toDate(data.createdAt),
      updatedAt: toDate(data.updatedAt ?? data.createdAt),
    };
  });
  if (projects.length) {
    await dataSource.getRepository(Project).upsert(projects, ['id']);
  }
  console.log(`Projects: ${projects.length}`);

  // ── Leads ──
  const leadsSnap = await getDocs(collection(firestore, 'leads'));
  const leads = leadsSnap.docs.map((d) => {
    const data = d.data();
    const notes = Array.isArray(data.notes)
      ? data.notes.map((n: Record<string, unknown>) => ({
          id: String(n.id),
          text: String(n.text ?? ''),
          createdAt: toDate(n.createdAt).toISOString(),
          createdBy: n.createdBy ? String(n.createdBy) : undefined,
        }))
      : [];
    return {
      id: d.id,
      company: data.company || '',
      contact: data.contact || '',
      email: data.email || undefined,
      phone: data.phone || undefined,
      industry: data.industry || undefined,
      country: data.country || undefined,
      monthlyEstimate: data.monthlyEstimate ?? undefined,
      source: data.source || undefined,
      salesExec: data.salesExec || undefined,
      stage: data.stage || 'prospect',
      notes,
      nextFollowUp: data.nextFollowUp ? toDate(data.nextFollowUp) : undefined,
      createdBy: data.createdBy || undefined,
      createdAt: toDate(data.createdAt),
      updatedAt: toDate(data.updatedAt ?? data.createdAt),
    };
  });
  if (leads.length) await dataSource.getRepository(Lead).upsert(leads, ['id']);
  console.log(`Leads: ${leads.length}`);

  // ── Customers ──
  const customersSnap = await getDocs(collection(firestore, 'customers'));
  const customers = customersSnap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      seq: data.seq ?? 0,
      company: data.company || '',
      contact: data.contact || undefined,
      email: data.email || undefined,
      phone: data.phone || undefined,
      country: data.country || undefined,
      status: data.status || 'active',
      projectsCount: data.projectsCount ?? undefined,
      notes: data.notes || undefined,
      createdBy: data.createdBy || undefined,
      createdAt: toDate(data.createdAt),
      updatedAt: toDate(data.updatedAt ?? data.createdAt),
    };
  });
  if (customers.length) {
    await dataSource.getRepository(Customer).upsert(customers, ['id']);
  }
  console.log(`Customers: ${customers.length}`);

  // ── Customer contacts ──
  const contactsSnap = await getDocs(collection(firestore, 'customerContacts'));
  const contacts = contactsSnap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      customerId: data.customerId || '',
      name: data.name || '',
      email: data.email || undefined,
      phone: data.phone || undefined,
      whatsappAvailable: data.whatsappAvailable ?? undefined,
      photoUrl: data.photoUrl || undefined,
      createdAt: toDate(data.createdAt),
    };
  });
  if (contacts.length) {
    await dataSource.getRepository(CustomerContact).upsert(contacts, ['id']);
  }
  console.log(`Customer contacts: ${contacts.length}`);

  // ── Customer documents ──
  const documentsSnap = await getDocs(collection(firestore, 'customerDocuments'));
  const documents = documentsSnap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      customerId: data.customerId || '',
      name: data.name || '',
      docType: data.docType || '',
      url: data.url || '',
      cloudinaryPublicId: data.cloudinaryPublicId || '',
      fileType: data.fileType || '',
      fileSize: data.fileSize ?? 0,
      createdBy: data.createdBy || undefined,
      createdAt: toDate(data.createdAt),
    };
  });
  if (documents.length) {
    await dataSource.getRepository(CustomerDocument).upsert(documents, ['id']);
  }
  console.log(`Customer documents: ${documents.length}`);

  // ── Customer messages ──
  const messagesSnap = await getDocs(collection(firestore, 'customerMessages'));
  const messages = messagesSnap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      customerId: data.customerId || '',
      channel: data.channel || 'internal',
      text: data.text || '',
      attachment: data.attachment || undefined,
      author: data.author || undefined,
      createdAt: toDate(data.createdAt),
    };
  });
  if (messages.length) {
    await dataSource.getRepository(CustomerMessage).upsert(messages, ['id']);
  }
  console.log(`Customer messages: ${messages.length}`);

  // ── Customer invoices ──
  const invoicesSnap = await getDocs(collection(firestore, 'customerInvoices'));
  const invoices = invoicesSnap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      customerId: data.customerId || '',
      projectId: data.projectId || undefined,
      projectName: data.projectName || undefined,
      invoiceNumber: data.invoiceNumber || '',
      billToAddress: data.billToAddress || undefined,
      billToTaxId: data.billToTaxId || undefined,
      currency: data.currency || '',
      lineItems: Array.isArray(data.lineItems) ? data.lineItems : [],
      applyTax: data.applyTax ?? undefined,
      taxRate: data.taxRate ?? undefined,
      subtotal: data.subtotal ?? 0,
      taxAmount: data.taxAmount ?? undefined,
      amount: data.amount ?? 0,
      dueDate: data.dueDate ? toDate(data.dueDate) : undefined,
      notes: data.notes || undefined,
      includeBankDetails: data.includeBankDetails ?? undefined,
      status: data.status || 'draft',
      createdAt: toDate(data.createdAt),
      updatedAt: toDate(data.updatedAt ?? data.createdAt),
    };
  });
  if (invoices.length) {
    await dataSource.getRepository(CustomerInvoice).upsert(invoices, ['id']);
  }
  console.log(`Customer invoices: ${invoices.length}`);

  console.log(
    `\nDone. Totals — users: ${users.length}, roles: ${roles.length}, master data: ${masterDataTotal}, management: ${managementTotal}, notifications: ${notifications.length}, settings: ${settingsTotal}, bugs: ${bugs.length}, bug comments: ${commentsTotal}, projects: ${projects.length}, leads: ${leads.length}, customers: ${customers.length}, contacts: ${contacts.length}, documents: ${documents.length}, messages: ${messages.length}, invoices: ${invoices.length}`,
  );

  await dataSource.destroy();
  process.exit(0);
}

main().catch((err) => {
  console.error('Backfill failed:', err);
  process.exit(1);
});

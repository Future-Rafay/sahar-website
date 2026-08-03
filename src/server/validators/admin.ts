import { z } from "zod";

const optionalText = (max: number) => z.string().trim().max(max).optional().transform((value) => value || null);
const integer = (minimum = 0) => z.coerce.number().int().min(minimum);
const optionalInteger = (minimum = 0) => z.union([z.literal(""), z.coerce.number().int().min(minimum)]).transform((value) => value === "" ? null : value);
const checkbox = z.union([z.literal("on"), z.literal("true"), z.literal("false"), z.undefined()]).transform((value) => value === "on" || value === "true");
const bilingualName = {
  nameDe: z.string().trim().min(1).max(180),
  nameEn: z.string().trim().min(1).max(180),
};

export const categorySchema = z.object({
  id: z.string().cuid().optional(),
  slug: z.string().trim().min(1).max(160).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  ...bilingualName,
  descriptionDe: optionalText(5000),
  descriptionEn: optionalText(5000),
  active: checkbox,
  sortOrder: integer(),
});

export const productSchema = z.object({
  id: z.string().cuid().optional(),
  categoryId: z.string().cuid(),
  slug: z.string().trim().min(1).max(180).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  ...bilingualName,
  descriptionDe: optionalText(10000),
  descriptionEn: optionalText(10000),
  imageKey: optionalText(512),
  active: checkbox,
  available: checkbox,
  sortOrder: integer(),
  isHalal: checkbox,
  isVegetarian: checkbox,
  isVegan: checkbox,
  spiceLevel: z.union([z.enum(["MILD", "MEDIUM", "HOT", "EXTRA_HOT"]), z.literal("")]).transform((value) => value || null),
  allergenIds: z.string().optional().transform((value) => value ? value.split(",").filter(Boolean) : []),
});

export const variantSchema = z.object({
  id: z.string().cuid().optional(),
  productId: z.string().cuid(),
  ...bilingualName,
  sku: optionalText(100),
  priceRappen: integer(),
  active: checkbox,
  sortOrder: integer(),
});

export const optionGroupSchema = z.object({
  id: z.string().cuid().optional(),
  productId: z.string().cuid(),
  ...bilingualName,
  required: checkbox,
  minimumSelections: integer(),
  maximumSelections: integer(1),
  active: checkbox,
  sortOrder: integer(),
}).refine((value) => value.minimumSelections <= value.maximumSelections, { message: "Minimum selections cannot exceed maximum selections." });

export const optionChoiceSchema = z.object({
  id: z.string().cuid().optional(),
  optionGroupId: z.string().cuid(),
  ...bilingualName,
  priceDeltaRappen: integer(),
  active: checkbox,
  sortOrder: integer(),
});

export const availabilityWindowSchema = z.object({
  id: z.string().cuid().optional(),
  productId: z.string().cuid(),
  weekday: z.enum(["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"]),
  startMinute: integer().max(1439),
  endMinute: integer(1).max(1440),
}).refine((value) => value.startMinute < value.endMinute, { message: "Start must be before end." });

export const fulfillmentSchema = z.object({
  deliveryEnabled: checkbox,
  pickupEnabled: checkbox,
  asapEnabled: checkbox,
  scheduledEnabled: checkbox,
  deliveryPrepMinutes: integer(1).max(1440),
  pickupPrepMinutes: integer(1).max(1440),
  minimumLeadMinutes: integer().max(10080),
  maximumAdvanceDays: integer(1).max(365),
  slotIntervalMinutes: integer(1).max(1440),
  defaultSlotCapacity: integer(1).max(10000),
  pickupInstructionsDe: optionalText(5000),
  pickupInstructionsEn: optionalText(5000),
}).refine((value) => value.deliveryEnabled || value.pickupEnabled, { message: "Enable delivery or pickup." });

export const openingWindowSchema = z.object({
  id: z.string().cuid().optional(),
  fulfillmentType: z.enum(["DELIVERY", "PICKUP"]),
  weekday: z.enum(["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"]),
  startMinute: integer().max(1439),
  endMinute: integer(1).max(1440),
  active: checkbox,
  sortOrder: integer(),
}).refine((value) => value.startMinute < value.endMinute, { message: "Start must be before end." });

export const serviceExceptionSchema = z.object({
  id: z.string().cuid().optional(),
  date: z.coerce.date(),
  fulfillmentType: z.enum(["DELIVERY", "PICKUP"]),
  closed: checkbox,
  startMinute: optionalInteger().pipe(z.number().max(1439).nullable()),
  endMinute: optionalInteger(1).pipe(z.number().max(1440).nullable()),
  note: optionalText(300),
}).refine((value) => value.closed || (value.startMinute !== null && value.endMinute !== null && value.startMinute < value.endMinute), { message: "Replacement hours require a valid start and end." });

export const zoneSchema = z.object({
  id: z.string().cuid().optional(),
  nameDe: z.string().trim().min(1).max(120),
  nameEn: z.string().trim().min(1).max(120),
  active: checkbox,
  feeRappen: integer(),
  minimumSubtotalRappen: integer(),
  freeDeliveryThresholdRappen: optionalInteger(),
  estimatedMinutes: integer(1).max(1440),
  sortOrder: integer(),
});

export const postalCodeSchema = z.object({
  id: z.string().cuid().optional(),
  deliveryZoneId: z.string().cuid(),
  postalCode: z.string().trim().regex(/^\d{4}$/),
});

export const siteSettingsSchema = z.object({
  displayName: z.string().trim().min(1).max(120),
  legalName: optionalText(160),
  email: z.union([z.literal(""), z.string().trim().email().max(320)]).transform((value) => value || null),
  phone: optionalText(40),
  street: optionalText(200),
  postalCode: optionalText(16),
  city: optionalText(120),
  primaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  secondaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  logoKey: optionalText(512),
  compactLogoKey: optionalText(512),
  faviconKey: optionalText(512),
  heroImageKey: optionalText(512),
  heroTitleDe: optionalText(240),
  heroTitleEn: optionalText(240),
  heroSubtitleDe: optionalText(5000),
  heroSubtitleEn: optionalText(5000),
  aboutDe: optionalText(10000),
  aboutEn: optionalText(10000),
  announcementDe: optionalText(500),
  announcementEn: optionalText(500),
  announcementActive: checkbox,
  instagramUrl: z.union([z.literal(""), z.string().trim().url().max(512)]).transform((value) => value || null),
  facebookUrl: z.union([z.literal(""), z.string().trim().url().max(512)]).transform((value) => value || null),
});

export const promoSchema = z.object({
  id: z.string().cuid().optional(),
  code: z.string().trim().min(1).max(64).regex(/^[A-Za-z0-9_-]+$/).transform((value) => value.toUpperCase()),
  type: z.enum(["FIXED", "PERCENT"]),
  value: integer(1),
  minimumSubtotalRappen: integer(),
  startsAt: z.union([z.literal(""), z.coerce.date()]).transform((value) => value === "" ? null : value),
  endsAt: z.union([z.literal(""), z.coerce.date()]).transform((value) => value === "" ? null : value),
  totalUsageLimit: optionalInteger(1),
  perCustomerLimit: optionalInteger(1),
  active: checkbox,
}).refine((value) => value.type !== "PERCENT" || value.value <= 10000, { message: "Percentage cannot exceed 100%." })
  .refine((value) => !value.startsAt || !value.endsAt || value.startsAt < value.endsAt, { message: "End must be after start." });

export const refundSchema = z.object({
  orderNumber: z.string().regex(/^SAH-\d{6,}$/i),
  amountRappen: integer(1),
  reason: z.string().trim().min(3).max(500),
  refundKey: z.string().uuid(),
  cancelOrder: checkbox,
});

export const cancelOrderSchema = z.object({
  orderNumber: z.string().regex(/^SAH-\d{6,}$/i),
  reason: z.string().trim().min(3).max(500),
});


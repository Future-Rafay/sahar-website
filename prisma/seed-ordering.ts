import type { PrismaClient } from "../src/generated/prisma/client";
import { saharMockDeliveryZones, saharMockMenu, saharRealContent } from "../src/content/phase-1";

const slugify = (value: string) =>
  value.replace(/^MOCK:\s*/, "").toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const priceToRappen = (value: string) => Math.round(Number(value.replace(/^MOCK:\s*CHF\s*/, "")) * 100);

export async function seedOrderingFixtures(prisma: PrismaClient) {
  const categories = new Map<string, string>();
  for (const item of saharMockMenu) {
    const categorySlug = slugify(item.categoryEn);
    if (!categories.has(categorySlug)) {
      const category = await prisma.category.upsert({
        where: { slug: categorySlug },
        create: { slug: categorySlug, nameDe: item.categoryDe, nameEn: item.categoryEn, sortOrder: categories.size },
        update: { nameDe: item.categoryDe, nameEn: item.categoryEn },
      });
      categories.set(categorySlug, category.id);
    }
    const productSlug = slugify(item.nameEn);
    const product = await prisma.product.upsert({
      where: { slug: productSlug },
      create: {
        categoryId: categories.get(categorySlug)!,
        slug: productSlug,
        nameDe: item.nameDe,
        nameEn: item.nameEn,
        descriptionDe: item.descriptionDe,
        descriptionEn: item.descriptionEn,
        imageKey: saharRealContent.logo,
        sortOrder: saharMockMenu.indexOf(item),
        isHalal: true,
      },
      update: {
        categoryId: categories.get(categorySlug)!,
        nameDe: item.nameDe,
        nameEn: item.nameEn,
        descriptionDe: item.descriptionDe,
        descriptionEn: item.descriptionEn,
      },
    });
    const sku = `MOCK-${productSlug.toUpperCase()}`;
    await prisma.productVariant.upsert({
      where: { sku },
      create: {
        productId: product.id,
        sku,
        nameDe: "MOCK: Standard",
        nameEn: "MOCK: Standard",
        priceRappen: priceToRappen(item.price),
      },
      update: { priceRappen: priceToRappen(item.price) },
    });
  }

  for (const [index, input] of saharMockDeliveryZones.entries()) {
    const zone = await prisma.deliveryZone.upsert({
      where: { id: `mock-zone-${index + 1}` },
      create: {
        id: `mock-zone-${index + 1}`,
        nameDe: input.nameDe,
        nameEn: input.nameEn,
        feeRappen: priceToRappen(input.deliveryFee),
        minimumSubtotalRappen: priceToRappen(input.minimumOrder),
        estimatedMinutes: 45 + index * 10,
        sortOrder: index,
      },
      update: {
        nameDe: input.nameDe,
        nameEn: input.nameEn,
        feeRappen: priceToRappen(input.deliveryFee),
        minimumSubtotalRappen: priceToRappen(input.minimumOrder),
      },
    });
    for (const value of input.postalCodes) {
      const postalCode = value.replace(/\D/g, "");
      await prisma.deliveryZonePostalCode.upsert({
        where: { postalCode },
        create: { postalCode, deliveryZoneId: zone.id },
        update: { deliveryZoneId: zone.id },
      });
    }
  }

  const weekdays = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"] as const;
  for (const fulfillmentType of ["DELIVERY", "PICKUP"] as const) {
    for (const [index, weekday] of weekdays.entries()) {
      const id = `mock-${fulfillmentType.toLowerCase()}-${weekday.toLowerCase()}`;
      await prisma.openingWindow.upsert({
        where: { id },
        create: { id, fulfillmentType, weekday, startMinute: index === 5 ? 720 : 660, endMinute: 1320 },
        update: {},
      });
    }
  }

  await prisma.promoCode.upsert({
    where: { code: "WELCOME10" },
    create: { code: "WELCOME10", type: "PERCENT", value: 1000, minimumSubtotalRappen: 2500 },
    update: {},
  });
}

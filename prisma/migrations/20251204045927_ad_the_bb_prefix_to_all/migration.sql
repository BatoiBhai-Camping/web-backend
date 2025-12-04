/*
  Warnings:

  - You are about to drop the `Address` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AgentProfile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AgentReview` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Booking` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Document` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `HotelStay` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Image` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ItineraryDay` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Meal` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MealPlan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Notification` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OptionalPhone` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PackageReview` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Payment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PlatformReview` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Transport` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TravelPackage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VisitPlace` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Address" DROP CONSTRAINT "Address_travelPackageId_fkey";

-- DropForeignKey
ALTER TABLE "Address" DROP CONSTRAINT "Address_userId_fkey";

-- DropForeignKey
ALTER TABLE "AgentProfile" DROP CONSTRAINT "AgentProfile_bannerImageId_fkey";

-- DropForeignKey
ALTER TABLE "AgentProfile" DROP CONSTRAINT "AgentProfile_userId_fkey";

-- DropForeignKey
ALTER TABLE "AgentReview" DROP CONSTRAINT "AgentReview_agentId_fkey";

-- DropForeignKey
ALTER TABLE "AgentReview" DROP CONSTRAINT "AgentReview_userId_fkey";

-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_packageId_fkey";

-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_userId_fkey";

-- DropForeignKey
ALTER TABLE "Document" DROP CONSTRAINT "Document_agentId_fkey";

-- DropForeignKey
ALTER TABLE "HotelStay" DROP CONSTRAINT "HotelStay_itineraryDayId_fkey";

-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_travelPackageId_fkey";

-- DropForeignKey
ALTER TABLE "ItineraryDay" DROP CONSTRAINT "ItineraryDay_packageId_fkey";

-- DropForeignKey
ALTER TABLE "Meal" DROP CONSTRAINT "Meal_mealPlanId_fkey";

-- DropForeignKey
ALTER TABLE "MealPlan" DROP CONSTRAINT "MealPlan_itineraryDayId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_userId_fkey";

-- DropForeignKey
ALTER TABLE "OptionalPhone" DROP CONSTRAINT "OptionalPhone_userId_fkey";

-- DropForeignKey
ALTER TABLE "PackageReview" DROP CONSTRAINT "PackageReview_packageId_fkey";

-- DropForeignKey
ALTER TABLE "PackageReview" DROP CONSTRAINT "PackageReview_userId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_bookingId_fkey";

-- DropForeignKey
ALTER TABLE "PlatformReview" DROP CONSTRAINT "PlatformReview_userId_fkey";

-- DropForeignKey
ALTER TABLE "Transport" DROP CONSTRAINT "Transport_itineraryDayId_fkey";

-- DropForeignKey
ALTER TABLE "TravelPackage" DROP CONSTRAINT "TravelPackage_packageBannerImageId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_profileImageId_fkey";

-- DropForeignKey
ALTER TABLE "VisitPlace" DROP CONSTRAINT "VisitPlace_itineraryDayId_fkey";

-- DropTable
DROP TABLE "Address";

-- DropTable
DROP TABLE "AgentProfile";

-- DropTable
DROP TABLE "AgentReview";

-- DropTable
DROP TABLE "Booking";

-- DropTable
DROP TABLE "Document";

-- DropTable
DROP TABLE "HotelStay";

-- DropTable
DROP TABLE "Image";

-- DropTable
DROP TABLE "ItineraryDay";

-- DropTable
DROP TABLE "Meal";

-- DropTable
DROP TABLE "MealPlan";

-- DropTable
DROP TABLE "Notification";

-- DropTable
DROP TABLE "OptionalPhone";

-- DropTable
DROP TABLE "PackageReview";

-- DropTable
DROP TABLE "Payment";

-- DropTable
DROP TABLE "PlatformReview";

-- DropTable
DROP TABLE "Transport";

-- DropTable
DROP TABLE "TravelPackage";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "VisitPlace";

-- CreateTable
CREATE TABLE "Bb_User" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "role" "UserRole" NOT NULL DEFAULT 'TRAVELER',
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "profileImageId" TEXT,
    "refreshToken" TEXT,
    "verifyToken" TEXT,

    CONSTRAINT "Bb_User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bb_OptionalPhone" (
    "id" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "isVerifyedNumber" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Bb_OptionalPhone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bb_AgentProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "description" TEXT,
    "status" "AgentStatus" NOT NULL DEFAULT 'PENDING',
    "aadharNumber" TEXT NOT NULL,
    "panNumber" TEXT,
    "gstNumber" TEXT,
    "bannerImageId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bb_AgentProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bb_Document" (
    "id" TEXT NOT NULL,
    "documentType" "DocumentType" NOT NULL,
    "documentUrl" TEXT NOT NULL,
    "documentFileId" TEXT,
    "agentId" TEXT NOT NULL,

    CONSTRAINT "Bb_Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bb_Address" (
    "id" TEXT NOT NULL,
    "addressType" "AddressType" NOT NULL DEFAULT 'PERMANENT',
    "country" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "pin" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "longitude" TEXT,
    "latitude" TEXT,
    "userId" TEXT,
    "travelPackageId" TEXT,

    CONSTRAINT "Bb_Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bb_TravelPackage" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "pricePerPerson" DOUBLE PRECISION NOT NULL,
    "advancedPerPerson" DOUBLE PRECISION NOT NULL,
    "discountAmount" INTEGER DEFAULT 0,
    "discountPercentage" INTEGER DEFAULT 0,
    "withTax" BOOLEAN DEFAULT false,
    "taxPercentage" INTEGER DEFAULT 0,
    "destination" TEXT NOT NULL,
    "durationDays" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "bookingActiveFrom" TIMESTAMP(3) NOT NULL,
    "bookingEndAt" TIMESTAMP(3) NOT NULL,
    "packagePolicies" TEXT NOT NULL DEFAULT 'NA',
    "cancellationPolicies" TEXT NOT NULL DEFAULT 'NA',
    "packageBannerImageId" TEXT,
    "isBookingActive" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tags" TEXT[],

    CONSTRAINT "Bb_TravelPackage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bb_Image" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "fileId" TEXT,
    "isDeleted" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "travelPackageId" TEXT,
    "userId" TEXT,

    CONSTRAINT "Bb_Image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bb_ItineraryDay" (
    "id" TEXT NOT NULL,
    "dayNumber" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "packageId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Bb_ItineraryDay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bb_HotelStay" (
    "id" TEXT NOT NULL,
    "hotelName" TEXT NOT NULL,
    "checkIn" TIMESTAMP(3),
    "checkOut" TIMESTAMP(3),
    "address" TEXT,
    "wifi" BOOLEAN,
    "tv" BOOLEAN,
    "attachWashroom" BOOLEAN,
    "acRoom" BOOLEAN,
    "kitchen" BOOLEAN,
    "itineraryDayId" TEXT NOT NULL,

    CONSTRAINT "Bb_HotelStay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bb_MealPlan" (
    "id" TEXT NOT NULL,
    "itineraryDayId" TEXT NOT NULL,

    CONSTRAINT "Bb_MealPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bb_Meal" (
    "id" TEXT NOT NULL,
    "type" "MealType" NOT NULL,
    "mealPlanId" TEXT NOT NULL,
    "mealDescription" TEXT,

    CONSTRAINT "Bb_Meal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bb_Transport" (
    "id" TEXT NOT NULL,
    "fromLocation" TEXT NOT NULL,
    "toLocation" TEXT NOT NULL,
    "mode" "TransportMode" NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "itineraryDayId" TEXT NOT NULL,

    CONSTRAINT "Bb_Transport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bb_VisitPlace" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "description" TEXT,
    "visitTime" TEXT,
    "itineraryDayId" TEXT NOT NULL,

    CONSTRAINT "Bb_VisitPlace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bb_Booking" (
    "id" TEXT NOT NULL,
    "bookingCode" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "packageId" TEXT NOT NULL,
    "numberOfTravelers" INTEGER NOT NULL DEFAULT 1,
    "status" "BookingStatus" NOT NULL DEFAULT 'PENDING',
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "baseAmount" DOUBLE PRECISION NOT NULL,
    "taxAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "discountAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "amountPaid" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "balanceDue" DOUBLE PRECISION NOT NULL,
    "fullPaymentDueAt" TIMESTAMP(3),
    "refundableAmount" DOUBLE PRECISION,
    "cancellationReason" TEXT,
    "cancelledAt" TIMESTAMP(3),
    "cancelledBy" "CancelledBy" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bb_Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bb_Payment" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "type" "PaymentType" NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "provider" "ProviderType" DEFAULT 'OTHER',
    "providerRef" TEXT,
    "isRefund" BOOLEAN DEFAULT false,
    "refundForId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bb_Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bb_PackageReview" (
    "id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "packageId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Bb_PackageReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bb_AgentReview" (
    "id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "agentId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Bb_AgentReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bb_PlatformReview" (
    "id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Bb_PlatformReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bb_Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Bb_Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Bb_User_email_key" ON "Bb_User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Bb_User_phone_key" ON "Bb_User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Bb_User_profileImageId_key" ON "Bb_User"("profileImageId");

-- CreateIndex
CREATE UNIQUE INDEX "Bb_OptionalPhone_phoneNumber_key" ON "Bb_OptionalPhone"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Bb_AgentProfile_userId_key" ON "Bb_AgentProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Bb_AgentProfile_bannerImageId_key" ON "Bb_AgentProfile"("bannerImageId");

-- CreateIndex
CREATE UNIQUE INDEX "Bb_TravelPackage_packageBannerImageId_key" ON "Bb_TravelPackage"("packageBannerImageId");

-- CreateIndex
CREATE UNIQUE INDEX "Bb_ItineraryDay_packageId_dayNumber_key" ON "Bb_ItineraryDay"("packageId", "dayNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Bb_HotelStay_itineraryDayId_key" ON "Bb_HotelStay"("itineraryDayId");

-- CreateIndex
CREATE UNIQUE INDEX "Bb_MealPlan_itineraryDayId_key" ON "Bb_MealPlan"("itineraryDayId");

-- CreateIndex
CREATE UNIQUE INDEX "Bb_Meal_mealPlanId_type_key" ON "Bb_Meal"("mealPlanId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "Bb_Booking_bookingCode_key" ON "Bb_Booking"("bookingCode");

-- CreateIndex
CREATE UNIQUE INDEX "Bb_PackageReview_packageId_userId_key" ON "Bb_PackageReview"("packageId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Bb_AgentReview_agentId_userId_key" ON "Bb_AgentReview"("agentId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Bb_PlatformReview_userId_key" ON "Bb_PlatformReview"("userId");

-- AddForeignKey
ALTER TABLE "Bb_User" ADD CONSTRAINT "Bb_User_profileImageId_fkey" FOREIGN KEY ("profileImageId") REFERENCES "Bb_Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bb_OptionalPhone" ADD CONSTRAINT "Bb_OptionalPhone_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Bb_User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bb_AgentProfile" ADD CONSTRAINT "Bb_AgentProfile_bannerImageId_fkey" FOREIGN KEY ("bannerImageId") REFERENCES "Bb_Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bb_AgentProfile" ADD CONSTRAINT "Bb_AgentProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Bb_User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bb_Document" ADD CONSTRAINT "Bb_Document_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Bb_AgentProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bb_Address" ADD CONSTRAINT "Bb_Address_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Bb_User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bb_Address" ADD CONSTRAINT "Bb_Address_travelPackageId_fkey" FOREIGN KEY ("travelPackageId") REFERENCES "Bb_TravelPackage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bb_TravelPackage" ADD CONSTRAINT "Bb_TravelPackage_packageBannerImageId_fkey" FOREIGN KEY ("packageBannerImageId") REFERENCES "Bb_Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bb_Image" ADD CONSTRAINT "Bb_Image_travelPackageId_fkey" FOREIGN KEY ("travelPackageId") REFERENCES "Bb_TravelPackage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bb_ItineraryDay" ADD CONSTRAINT "Bb_ItineraryDay_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Bb_TravelPackage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bb_HotelStay" ADD CONSTRAINT "Bb_HotelStay_itineraryDayId_fkey" FOREIGN KEY ("itineraryDayId") REFERENCES "Bb_ItineraryDay"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bb_MealPlan" ADD CONSTRAINT "Bb_MealPlan_itineraryDayId_fkey" FOREIGN KEY ("itineraryDayId") REFERENCES "Bb_ItineraryDay"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bb_Meal" ADD CONSTRAINT "Bb_Meal_mealPlanId_fkey" FOREIGN KEY ("mealPlanId") REFERENCES "Bb_MealPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bb_Transport" ADD CONSTRAINT "Bb_Transport_itineraryDayId_fkey" FOREIGN KEY ("itineraryDayId") REFERENCES "Bb_ItineraryDay"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bb_VisitPlace" ADD CONSTRAINT "Bb_VisitPlace_itineraryDayId_fkey" FOREIGN KEY ("itineraryDayId") REFERENCES "Bb_ItineraryDay"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bb_Booking" ADD CONSTRAINT "Bb_Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Bb_User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bb_Booking" ADD CONSTRAINT "Bb_Booking_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Bb_TravelPackage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bb_Payment" ADD CONSTRAINT "Bb_Payment_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Bb_Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bb_PackageReview" ADD CONSTRAINT "Bb_PackageReview_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Bb_TravelPackage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bb_PackageReview" ADD CONSTRAINT "Bb_PackageReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Bb_User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bb_AgentReview" ADD CONSTRAINT "Bb_AgentReview_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Bb_AgentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bb_AgentReview" ADD CONSTRAINT "Bb_AgentReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Bb_User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bb_PlatformReview" ADD CONSTRAINT "Bb_PlatformReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Bb_User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bb_Notification" ADD CONSTRAINT "Bb_Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Bb_User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the `Bb_Address` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Bb_AgentProfile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Bb_AgentReview` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Bb_Booking` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Bb_Document` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Bb_HotelStay` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Bb_Image` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Bb_ItineraryDay` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Bb_Meal` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Bb_MealPlan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Bb_Notification` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Bb_OptionalPhone` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Bb_PackageReview` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Bb_Payment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Bb_PlatformReview` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Bb_Transport` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Bb_TravelPackage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Bb_User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Bb_VisitPlace` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Bb_Address" DROP CONSTRAINT "Bb_Address_travelPackageId_fkey";

-- DropForeignKey
ALTER TABLE "Bb_Address" DROP CONSTRAINT "Bb_Address_userId_fkey";

-- DropForeignKey
ALTER TABLE "Bb_AgentProfile" DROP CONSTRAINT "Bb_AgentProfile_bannerImageId_fkey";

-- DropForeignKey
ALTER TABLE "Bb_AgentProfile" DROP CONSTRAINT "Bb_AgentProfile_userId_fkey";

-- DropForeignKey
ALTER TABLE "Bb_AgentReview" DROP CONSTRAINT "Bb_AgentReview_agentId_fkey";

-- DropForeignKey
ALTER TABLE "Bb_AgentReview" DROP CONSTRAINT "Bb_AgentReview_userId_fkey";

-- DropForeignKey
ALTER TABLE "Bb_Booking" DROP CONSTRAINT "Bb_Booking_packageId_fkey";

-- DropForeignKey
ALTER TABLE "Bb_Booking" DROP CONSTRAINT "Bb_Booking_userId_fkey";

-- DropForeignKey
ALTER TABLE "Bb_Document" DROP CONSTRAINT "Bb_Document_agentId_fkey";

-- DropForeignKey
ALTER TABLE "Bb_HotelStay" DROP CONSTRAINT "Bb_HotelStay_itineraryDayId_fkey";

-- DropForeignKey
ALTER TABLE "Bb_Image" DROP CONSTRAINT "Bb_Image_travelPackageId_fkey";

-- DropForeignKey
ALTER TABLE "Bb_ItineraryDay" DROP CONSTRAINT "Bb_ItineraryDay_packageId_fkey";

-- DropForeignKey
ALTER TABLE "Bb_Meal" DROP CONSTRAINT "Bb_Meal_mealPlanId_fkey";

-- DropForeignKey
ALTER TABLE "Bb_MealPlan" DROP CONSTRAINT "Bb_MealPlan_itineraryDayId_fkey";

-- DropForeignKey
ALTER TABLE "Bb_Notification" DROP CONSTRAINT "Bb_Notification_userId_fkey";

-- DropForeignKey
ALTER TABLE "Bb_OptionalPhone" DROP CONSTRAINT "Bb_OptionalPhone_userId_fkey";

-- DropForeignKey
ALTER TABLE "Bb_PackageReview" DROP CONSTRAINT "Bb_PackageReview_packageId_fkey";

-- DropForeignKey
ALTER TABLE "Bb_PackageReview" DROP CONSTRAINT "Bb_PackageReview_userId_fkey";

-- DropForeignKey
ALTER TABLE "Bb_Payment" DROP CONSTRAINT "Bb_Payment_bookingId_fkey";

-- DropForeignKey
ALTER TABLE "Bb_PlatformReview" DROP CONSTRAINT "Bb_PlatformReview_userId_fkey";

-- DropForeignKey
ALTER TABLE "Bb_Transport" DROP CONSTRAINT "Bb_Transport_itineraryDayId_fkey";

-- DropForeignKey
ALTER TABLE "Bb_TravelPackage" DROP CONSTRAINT "Bb_TravelPackage_packageBannerImageId_fkey";

-- DropForeignKey
ALTER TABLE "Bb_User" DROP CONSTRAINT "Bb_User_profileImageId_fkey";

-- DropForeignKey
ALTER TABLE "Bb_VisitPlace" DROP CONSTRAINT "Bb_VisitPlace_itineraryDayId_fkey";

-- DropTable
DROP TABLE "Bb_Address";

-- DropTable
DROP TABLE "Bb_AgentProfile";

-- DropTable
DROP TABLE "Bb_AgentReview";

-- DropTable
DROP TABLE "Bb_Booking";

-- DropTable
DROP TABLE "Bb_Document";

-- DropTable
DROP TABLE "Bb_HotelStay";

-- DropTable
DROP TABLE "Bb_Image";

-- DropTable
DROP TABLE "Bb_ItineraryDay";

-- DropTable
DROP TABLE "Bb_Meal";

-- DropTable
DROP TABLE "Bb_MealPlan";

-- DropTable
DROP TABLE "Bb_Notification";

-- DropTable
DROP TABLE "Bb_OptionalPhone";

-- DropTable
DROP TABLE "Bb_PackageReview";

-- DropTable
DROP TABLE "Bb_Payment";

-- DropTable
DROP TABLE "Bb_PlatformReview";

-- DropTable
DROP TABLE "Bb_Transport";

-- DropTable
DROP TABLE "Bb_TravelPackage";

-- DropTable
DROP TABLE "Bb_User";

-- DropTable
DROP TABLE "Bb_VisitPlace";

-- CreateTable
CREATE TABLE "Bb_user" (
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

    CONSTRAINT "Bb_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bb_optionalPhone" (
    "id" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "isVerifyedNumber" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Bb_optionalPhone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bb_agentProfile" (
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

    CONSTRAINT "Bb_agentProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bb_document" (
    "id" TEXT NOT NULL,
    "documentType" "DocumentType" NOT NULL,
    "documentUrl" TEXT NOT NULL,
    "documentFileId" TEXT,
    "agentId" TEXT NOT NULL,

    CONSTRAINT "Bb_document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bb_address" (
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

    CONSTRAINT "Bb_address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bb_travelPackage" (
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

    CONSTRAINT "Bb_travelPackage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bb_image" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "fileId" TEXT,
    "isDeleted" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "travelPackageId" TEXT,
    "userId" TEXT,

    CONSTRAINT "Bb_image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bb_itineraryDay" (
    "id" TEXT NOT NULL,
    "dayNumber" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "packageId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Bb_itineraryDay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bb_hotelStay" (
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

    CONSTRAINT "Bb_hotelStay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bb_mealPlan" (
    "id" TEXT NOT NULL,
    "itineraryDayId" TEXT NOT NULL,

    CONSTRAINT "Bb_mealPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bb_meal" (
    "id" TEXT NOT NULL,
    "type" "MealType" NOT NULL,
    "mealPlanId" TEXT NOT NULL,
    "mealDescription" TEXT,

    CONSTRAINT "Bb_meal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bb_transport" (
    "id" TEXT NOT NULL,
    "fromLocation" TEXT NOT NULL,
    "toLocation" TEXT NOT NULL,
    "mode" "TransportMode" NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "itineraryDayId" TEXT NOT NULL,

    CONSTRAINT "Bb_transport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bb_visitPlace" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "description" TEXT,
    "visitTime" TEXT,
    "itineraryDayId" TEXT NOT NULL,

    CONSTRAINT "Bb_visitPlace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bb_booking" (
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

    CONSTRAINT "Bb_booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bb_payment" (
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

    CONSTRAINT "Bb_payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bb_packageReview" (
    "id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "packageId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Bb_packageReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bb_agentReview" (
    "id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "agentId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Bb_agentReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bb_platformReview" (
    "id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Bb_platformReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bb_notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Bb_notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Bb_user_email_key" ON "Bb_user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Bb_user_phone_key" ON "Bb_user"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Bb_user_profileImageId_key" ON "Bb_user"("profileImageId");

-- CreateIndex
CREATE UNIQUE INDEX "Bb_optionalPhone_phoneNumber_key" ON "Bb_optionalPhone"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Bb_agentProfile_userId_key" ON "Bb_agentProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Bb_agentProfile_bannerImageId_key" ON "Bb_agentProfile"("bannerImageId");

-- CreateIndex
CREATE UNIQUE INDEX "Bb_travelPackage_packageBannerImageId_key" ON "Bb_travelPackage"("packageBannerImageId");

-- CreateIndex
CREATE UNIQUE INDEX "Bb_itineraryDay_packageId_dayNumber_key" ON "Bb_itineraryDay"("packageId", "dayNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Bb_hotelStay_itineraryDayId_key" ON "Bb_hotelStay"("itineraryDayId");

-- CreateIndex
CREATE UNIQUE INDEX "Bb_mealPlan_itineraryDayId_key" ON "Bb_mealPlan"("itineraryDayId");

-- CreateIndex
CREATE UNIQUE INDEX "Bb_meal_mealPlanId_type_key" ON "Bb_meal"("mealPlanId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "Bb_booking_bookingCode_key" ON "Bb_booking"("bookingCode");

-- CreateIndex
CREATE UNIQUE INDEX "Bb_packageReview_packageId_userId_key" ON "Bb_packageReview"("packageId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Bb_agentReview_agentId_userId_key" ON "Bb_agentReview"("agentId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Bb_platformReview_userId_key" ON "Bb_platformReview"("userId");

-- AddForeignKey
ALTER TABLE "Bb_user" ADD CONSTRAINT "Bb_user_profileImageId_fkey" FOREIGN KEY ("profileImageId") REFERENCES "Bb_image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bb_optionalPhone" ADD CONSTRAINT "Bb_optionalPhone_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Bb_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bb_agentProfile" ADD CONSTRAINT "Bb_agentProfile_bannerImageId_fkey" FOREIGN KEY ("bannerImageId") REFERENCES "Bb_image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bb_agentProfile" ADD CONSTRAINT "Bb_agentProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Bb_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bb_document" ADD CONSTRAINT "Bb_document_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Bb_agentProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bb_address" ADD CONSTRAINT "Bb_address_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Bb_user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bb_address" ADD CONSTRAINT "Bb_address_travelPackageId_fkey" FOREIGN KEY ("travelPackageId") REFERENCES "Bb_travelPackage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bb_travelPackage" ADD CONSTRAINT "Bb_travelPackage_packageBannerImageId_fkey" FOREIGN KEY ("packageBannerImageId") REFERENCES "Bb_image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bb_image" ADD CONSTRAINT "Bb_image_travelPackageId_fkey" FOREIGN KEY ("travelPackageId") REFERENCES "Bb_travelPackage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bb_itineraryDay" ADD CONSTRAINT "Bb_itineraryDay_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Bb_travelPackage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bb_hotelStay" ADD CONSTRAINT "Bb_hotelStay_itineraryDayId_fkey" FOREIGN KEY ("itineraryDayId") REFERENCES "Bb_itineraryDay"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bb_mealPlan" ADD CONSTRAINT "Bb_mealPlan_itineraryDayId_fkey" FOREIGN KEY ("itineraryDayId") REFERENCES "Bb_itineraryDay"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bb_meal" ADD CONSTRAINT "Bb_meal_mealPlanId_fkey" FOREIGN KEY ("mealPlanId") REFERENCES "Bb_mealPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bb_transport" ADD CONSTRAINT "Bb_transport_itineraryDayId_fkey" FOREIGN KEY ("itineraryDayId") REFERENCES "Bb_itineraryDay"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bb_visitPlace" ADD CONSTRAINT "Bb_visitPlace_itineraryDayId_fkey" FOREIGN KEY ("itineraryDayId") REFERENCES "Bb_itineraryDay"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bb_booking" ADD CONSTRAINT "Bb_booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Bb_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bb_booking" ADD CONSTRAINT "Bb_booking_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Bb_travelPackage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bb_payment" ADD CONSTRAINT "Bb_payment_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Bb_booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bb_packageReview" ADD CONSTRAINT "Bb_packageReview_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Bb_travelPackage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bb_packageReview" ADD CONSTRAINT "Bb_packageReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Bb_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bb_agentReview" ADD CONSTRAINT "Bb_agentReview_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Bb_agentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bb_agentReview" ADD CONSTRAINT "Bb_agentReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Bb_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bb_platformReview" ADD CONSTRAINT "Bb_platformReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Bb_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bb_notification" ADD CONSTRAINT "Bb_notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Bb_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

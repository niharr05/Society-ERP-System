export type UserRole = 'SUPER_ADMIN' | 'SOCIETY_ADMIN' | 'RESIDENT' | 'SECURITY';

export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING_APPROVAL';

export type OccupancyType = 'OWNER' | 'TENANT';

export interface User {
  uid: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  societyId: string;
  societyName?: string;
  unitId?: string;
  unitNumber?: string;
  block?: string;
  occupancyType?: OccupancyType;
  status: UserStatus;
  fcmTokens?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Society {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  totalBlocks: number;
  totalUnits: number;
  registrationNumber: string;
  billingConfig: {
    maintenancePerSqFt?: number;
    fixedMonthlyFee?: number;
    dueDayOfMonth: number;
    lateFeePercentage: number;
    gracePeriodDays: number;
  };
  createdAt: string;
}

export interface Unit {
  id: string;
  societyId: string;
  block: string;
  unitNumber: string;
  floor: number;
  sizeSqFt: number;
  occupancyType: OccupancyType;
  ownerId?: string;
  tenantId?: string;
  residentCount: number;
  vehiclesCount: number;
  createdAt: string;
}

export interface ChargeItem {
  name: string;
  amount: number;
}

export type BillStatus = 'UNPAID' | 'PAID' | 'OVERDUE' | 'PARTIALLY_PAID';

export interface Bill {
  id: string;
  societyId: string;
  unitId: string;
  unitNumber: string;
  block: string;
  residentName: string;
  residentId: string;
  month: string;
  year: number;
  dueDate: string;
  breakdown: ChargeItem[];
  subtotal: number;
  lateFee: number;
  totalAmount: number;
  status: BillStatus;
  paymentId?: string;
  pdfUrl?: string;
  createdAt: string;
}

export type PaymentMode = 'RAZORPAY' | 'CASH' | 'CHEQUE' | 'BANK_TRANSFER';
export type PaymentStatus = 'SUCCESS' | 'PENDING' | 'FAILED';

export interface Payment {
  id: string;
  societyId: string;
  unitId: string;
  billId: string;
  residentId: string;
  residentName: string;
  amount: number;
  mode: PaymentMode;
  status: PaymentStatus;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  receiptNumber: string;
  paidAt: string;
}

export type ComplaintCategory = 'PLUMBING' | 'ELECTRICAL' | 'SECURITY' | 'CLEANLINESS' | 'NOISE' | 'OTHER';
export type ComplaintPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type ComplaintStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';

export interface ComplaintComment {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  text: string;
  createdAt: string;
}

export interface Complaint {
  id: string;
  societyId: string;
  unitId: string;
  unitNumber: string;
  residentId: string;
  residentName: string;
  category: ComplaintCategory;
  title: string;
  description: string;
  photos: string[];
  priority: ComplaintPriority;
  status: ComplaintStatus;
  assignedToName?: string;
  comments: ComplaintComment[];
  createdAt: string;
  updatedAt: string;
}

export type VisitorType = 'GUEST' | 'DELIVERY' | 'CAB' | 'SERVICE_PROVIDER' | 'OTHER';
export type VisitorStatus = 'EXPECTED' | 'CHECKED_IN' | 'CHECKED_OUT' | 'DENIED' | 'CANCELLED';

export interface Visitor {
  id: string;
  societyId: string;
  unitId: string;
  unitNumber: string;
  residentId: string;
  residentName: string;
  visitorName: string;
  phone: string;
  type: VisitorType;
  vehicleNumber?: string;
  passCode: string;
  qrData?: string;
  status: VisitorStatus;
  expectedDate: string;
  entryTime?: string;
  exitTime?: string;
  entryApprovedBy?: string;
  notes?: string;
  createdAt: string;
}

export interface Notice {
  id: string;
  societyId: string;
  title: string;
  content: string;
  category: 'GENERAL' | 'MAINTENANCE' | 'EVENT' | 'EMERGENCY';
  isImportant: boolean;
  authorName: string;
  authorRole: UserRole;
  createdAt: string;
}

export interface Amenity {
  id: string;
  societyId: string;
  name: string;
  description: string;
  capacity: number;
  timing: string;
  pricePerHour: number;
  imageUrl?: string;
  isActive: boolean;
}

export type BookingStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

export interface AmenityBooking {
  id: string;
  societyId: string;
  amenityId: string;
  amenityName: string;
  unitId: string;
  unitNumber: string;
  residentId: string;
  residentName: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  totalAmount: number;
  status: BookingStatus;
  createdAt: string;
}

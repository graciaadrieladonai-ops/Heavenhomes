export type Property = {
  id: string;
  title: string;
  description: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  type: string;
  availableDate: string;
  images: string[];
  amenities: string[];
  applicationFee: number;
  viewCodeUrl: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

export type PaymentMethod = "cashapp" | "walmart" | "zelle" | "crypto";

export type PaymentAccounts = {
  cashapp: {
    cashtag: string;
    name: string;
    notes: string;
    updatedAt: string;
  };
  walmart: {
    receiverName: string;
    phone: string;
    notes: string;
    updatedAt: string;
  };
  zelle: {
    emailOrPhone: string;
    name: string;
    notes: string;
    updatedAt: string;
  };
  crypto: {
    network: string;
    address: string;
    notes: string;
    updatedAt: string;
  };
};

export type ApplicationStatus =
  | "applied"
  | "tour_scheduled"
  | "payment_submitted"
  | "txn_issued"
  | "paid";

export type Application = {
  id: string;
  propertyId: string;
  status: ApplicationStatus;
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  ssn: string;
  currentAddress: string;
  currentCity: string;
  currentState: string;
  currentZip: string;
  housingStatus: string;
  yearsAtAddress: string;
  landlordName: string;
  landlordPhone: string;
  currentRent: string;
  reasonForMoving: string;
  employmentStatus: string;
  employer: string;
  jobTitle: string;
  monthlyIncome: string;
  yearsEmployed: string;
  supervisorPhone: string;
  occupants: string;
  occupantNames: string;
  hasPets: string;
  petDetails: string;
  vehicles: string;
  smokes: string;
  emergencyName: string;
  emergencyPhone: string;
  emergencyRelation: string;
  idFrontPath: string;
  idBackPath: string;
  certified: boolean;
  tourDate: string;
  tourTime: string;
  tourNotes: string;
  paymentMethod: PaymentMethod | "";
  paymentReference: string;
  paymentProofPath: string;
  paymentConfirmedAt: string;
  transactionId: string;
  txnAttempts: number;
  receiptNumber: string;
  tourCode: string;
  paidHold: boolean;
  amountPaid: number;
  createdAt: string;
  updatedAt: string;
};

export type Maintainer = {
  id: string;
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  ssn: string;
  currentAddress: string;
  currentCity: string;
  currentState: string;
  currentZip: string;
  categories: string[];
  categoryOther: string;
  experience: string;
  availableDays: string[];
  payPerTwoVisits: string;
  bankName: string;
  accountHolderName: string;
  routingNumber: string;
  accountNumber: string;
  accountType: string;
  idFrontPath: string;
  idBackPath: string;
  letterNumber: string;
  createdAt: string;
};

export type Database = {
  properties: Property[];
  applications: Application[];
  maintainers: Maintainer[];
  paymentAccounts: PaymentAccounts;
};

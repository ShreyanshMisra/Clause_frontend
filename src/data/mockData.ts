// Mock data for development and design purposes
// Replace with actual API calls in production

export const mockDocuments = [
  {
    id: 1,
    title: "Lease - 123 Main St, Apt 4B",
    type: "Lease",
    uploadedDate: "Jan 12, 2025",
    lastAnalyzed: "Jan 13, 2025",
    status: "Analyzed",
    statusColor: "severity-low",
    recovery: "$3,250",
    thumbnail: "🏠",
  },
  {
    id: 2,
    title: "Hospital Bill - Baystate Medical",
    type: "Medical Bill",
    uploadedDate: "Feb 3, 2025",
    lastAnalyzed: "Feb 3, 2025",
    status: "Needs review",
    statusColor: "severity-medium",
    recovery: "$780",
    thumbnail: "🏥",
  },
  {
    id: 3,
    title: "Lease - 45 Elm St, Unit 2",
    type: "Lease",
    uploadedDate: "Feb 20, 2025",
    lastAnalyzed: "Feb 21, 2025",
    status: "Draft case created",
    statusColor: "severity-low",
    recovery: "$1,100",
    thumbnail: "📄",
  },
  {
    id: 4,
    title: "Medical Bill - Massachusetts General Hospital",
    type: "Medical Bill",
    uploadedDate: "Mar 5, 2025",
    lastAnalyzed: "Mar 5, 2025",
    status: "Analyzed",
    statusColor: "severity-low",
    recovery: "$450",
    thumbnail: "🏥",
  },
  {
    id: 5,
    title: "Lease - 789 Pine Ave, Suite 301",
    type: "Lease",
    uploadedDate: "Mar 15, 2025",
    lastAnalyzed: "Mar 16, 2025",
    status: "Needs review",
    statusColor: "severity-medium",
    recovery: "$2,800",
    thumbnail: "🏠",
  },
];

export const mockPolicies = [
  {
    id: 1,
    title: "Security Deposit Return – Massachusetts",
    type: "Law",
    summary:
      "Landlords must return the security deposit within 30 days after the end of the tenancy, along with an itemized statement of any deductions.",
    tags: ["Security Deposit", "Massachusetts", "Move-out"],
    violationFrequency: "High",
    violationColor: "severity-high",
    referencedIn: 5,
  },
  {
    id: 2,
    title: "Limits on Late Fees",
    type: "Guide",
    summary:
      "Explains when and how landlords can charge late fees, including grace periods and maximum amounts allowed by law.",
    tags: ["Late Fees", "Rent"],
    violationFrequency: "Medium",
    violationColor: "severity-medium",
    referencedIn: 2,
  },
  {
    id: 3,
    title: "Itemized Deductions for Damage",
    type: "Law",
    summary:
      "Landlords must provide an itemized list of damages before keeping any part of the deposit. This must be provided within 30 days.",
    tags: ["Damage", "Itemized List", "Security Deposit"],
    violationFrequency: "Low",
    violationColor: "severity-low",
    referencedIn: null,
  },
  {
    id: 4,
    title: "Medical Billing Transparency Requirements",
    type: "Law",
    summary:
      "Medical providers must provide clear, itemized billing statements that break down all charges and services rendered.",
    tags: ["Medical Billing", "Transparency", "Patient Rights"],
    violationFrequency: "Medium",
    violationColor: "severity-medium",
    referencedIn: 2,
  },
  {
    id: 5,
    title: "Triple Damages for Security Deposit Violations",
    type: "Law",
    summary:
      "Landlords who fail to return security deposits or provide itemized deductions on time may be liable for triple damages plus interest.",
    tags: ["Security Deposit", "Damages", "Penalties"],
    violationFrequency: "High",
    violationColor: "severity-high",
    referencedIn: 4,
  },
];

export const mockCases = [
  {
    id: 101,
    title: "Security Deposit – 123 Main St",
    type: "Lease",
    status: "ready",
    statusLabel: "Ready for action",
    statusColor: "coral",
    lastActivity: "Jan 15, 2025 at 2:32 PM",
    recovery: "$3,250",
    documentId: 1,
    uploadedDate: "Jan 12, 2025",
  },
  {
    id: 102,
    title: "Hospital Bill – Baystate Medical",
    type: "Medical Bill",
    status: "checking",
    statusLabel: "Checking",
    statusColor: "gold",
    lastActivity: "Feb 4, 2025 at 9:18 AM",
    recovery: "$780",
    documentId: 2,
    uploadedDate: "Feb 3, 2025",
  },
  {
    id: 103,
    title: "Lease – 45 Elm St",
    type: "Lease",
    status: "resolved",
    statusLabel: "Resolved 🎉",
    statusColor: "mint",
    lastActivity: "Feb 23, 2025 at 11:01 AM",
    recovery: "$1,100",
    documentId: 3,
    uploadedDate: "Feb 20, 2025",
  },
  {
    id: 104,
    title: "Medical Bill Overcharge – MGH",
    type: "Medical Bill",
    status: "ready",
    statusLabel: "Ready for action",
    statusColor: "coral",
    lastActivity: "Mar 6, 2025 at 3:45 PM",
    recovery: "$450",
    documentId: 4,
    uploadedDate: "Mar 5, 2025",
  },
  {
    id: 105,
    title: "Security Deposit – 789 Pine Ave",
    type: "Lease",
    status: "checking",
    statusLabel: "Checking",
    statusColor: "gold",
    lastActivity: "Mar 17, 2025 at 10:22 AM",
    recovery: "$2,800",
    documentId: 5,
    uploadedDate: "Mar 15, 2025",
  },
];

export const mockCaseDetails = {
  101: {
    id: 101,
    title: "Security Deposit – 123 Main St",
    type: "Lease",
    status: "ready",
    statusLabel: "Ready for action",
    statusColor: "coral",
    uploadedDate: "Jan 12, 2025",
    lastActivity: "Jan 15, 2025 at 2:32 PM",
    recovery: "$3,250",
    documentId: 1,
    location: "Massachusetts",
    category: "Tenant rights",
    overview: {
      description:
        "Your landlord may be holding your security deposit longer than allowed by Massachusetts law.",
      keyPoints: [
        { label: "Deposit", value: "$1,500", icon: "💰" },
        { label: "Move-out date", value: "Apr 30, 2025", icon: "📅" },
        { label: "Days since move-out", value: "45", icon: "⏱️" },
      ],
    },
    issues: [
      {
        id: 1,
        title: "Security deposit held more than 30 days",
        severity: "high",
        summary:
          "Your landlord failed to return your security deposit within 30 days of move-out, which violates Massachusetts state law.",
        statute: "M.G.L. c. 186 §15B",
        impact:
          "You may be entitled to 3x your deposit ($4,500) plus interest.",
        explanation:
          "Under Massachusetts law, landlords have 30 days after the end of your tenancy to return your security deposit or provide an itemized list of deductions.",
        nextSteps: [
          "Send a demand letter requesting return of deposit plus triple damages",
          "File a complaint with the local housing authority if no response",
          "Consider small claims court if the amount exceeds the demand",
        ],
      },
      {
        id: 2,
        title: "Illegal late fee amount",
        severity: "medium",
        summary:
          "The late fee charged exceeds the legal limit of 5% of monthly rent or $30, whichever is greater.",
        statute: "M.G.L. c. 186 §15B",
        impact:
          "You may be entitled to a refund of the excess late fee amount.",
        explanation:
          "Massachusetts caps late fees at the greater of 5% of monthly rent or $30. Your rent is $2,000/month, so the maximum late fee is $100.",
        nextSteps: [
          "Review all late fee charges on your payment history",
          "Request refund of any excess charges",
          "Document all late fee payments made",
        ],
      },
    ],
    timeline: [
      {
        event: "Document uploaded",
        date: "Jan 12, 2025",
        time: "10:15 AM",
        note: null,
      },
      {
        event: "Initial analysis complete",
        date: "Jan 12, 2025",
        time: "10:17 AM",
        note: "AI found 3 potential issues",
      },
      {
        event: "Review confirmed",
        date: "Jan 13, 2025",
        time: "2:30 PM",
        note: "User confirmed detected information",
      },
      {
        event: "Demand letter generated",
        date: "Jan 15, 2025",
        time: "2:32 PM",
        note: "Letter ready for download",
      },
    ],
    financialSummary: {
      total: "$3,250",
      breakdown: [
        { label: "Security Deposit", amount: "$1,500", color: "peach" },
        { label: "Triple Damages", amount: "$4,500", color: "coral" },
        { label: "Interest", amount: "$250", color: "gold" },
        { label: "Illegal Fees", amount: "$200", color: "coral" },
      ],
    },
  },
  102: {
    id: 102,
    title: "Hospital Bill – Baystate Medical",
    type: "Medical Bill",
    status: "checking",
    statusLabel: "Checking",
    statusColor: "gold",
    uploadedDate: "Feb 3, 2025",
    lastActivity: "Feb 4, 2025 at 9:18 AM",
    recovery: "$780",
    documentId: 2,
    location: "Massachusetts",
    category: "Patient rights",
    overview: {
      description:
        "We're reviewing your medical bill for potential billing errors and overcharges.",
      keyPoints: [
        { label: "Total bill", value: "$2,450", icon: "💰" },
        { label: "Service date", value: "Jan 15, 2025", icon: "📅" },
        { label: "Days to review", value: "20", icon: "⏱️" },
      ],
    },
    issues: [
      {
        id: 1,
        title: "Unclear itemization of charges",
        severity: "medium",
        summary:
          "The bill does not clearly break down all charges and services rendered as required by law.",
        statute: "Medical Billing Transparency Act",
        impact:
          "You may be entitled to a corrected bill or refund of unclear charges.",
        explanation:
          "Massachusetts requires medical providers to provide clear, itemized billing statements.",
        nextSteps: [
          "Request an itemized bill from the provider",
          "Review each charge for accuracy",
          "Dispute any unclear or incorrect charges",
        ],
      },
    ],
    timeline: [
      {
        event: "Document uploaded",
        date: "Feb 3, 2025",
        time: "2:15 PM",
        note: null,
      },
      {
        event: "Initial analysis complete",
        date: "Feb 3, 2025",
        time: "2:18 PM",
        note: "AI found potential issues",
      },
      {
        event: "Review in progress",
        date: "Feb 4, 2025",
        time: "9:18 AM",
        note: "Analyzing billing codes",
      },
    ],
    financialSummary: {
      total: "$780",
      breakdown: [
        { label: "Potential Overcharges", amount: "$500", color: "coral" },
        { label: "Billing Errors", amount: "$280", color: "gold" },
      ],
    },
  },
  103: {
    id: 103,
    title: "Lease – 45 Elm St",
    type: "Lease",
    status: "resolved",
    statusLabel: "Resolved 🎉",
    statusColor: "mint",
    uploadedDate: "Feb 20, 2025",
    lastActivity: "Feb 23, 2025 at 11:01 AM",
    recovery: "$1,100",
    documentId: 3,
    location: "Massachusetts",
    category: "Tenant rights",
    overview: {
      description:
        "This case has been successfully resolved. Your landlord returned the deposit plus damages.",
      keyPoints: [
        { label: "Deposit returned", value: "$800", icon: "💰" },
        { label: "Resolution date", value: "Feb 23, 2025", icon: "📅" },
        { label: "Total recovered", value: "$1,100", icon: "✅" },
      ],
    },
    issues: [],
    timeline: [
      {
        event: "Document uploaded",
        date: "Feb 20, 2025",
        time: "3:30 PM",
        note: null,
      },
      {
        event: "Initial analysis complete",
        date: "Feb 20, 2025",
        time: "3:33 PM",
        note: "AI found 2 potential issues",
      },
      {
        event: "Review confirmed",
        date: "Feb 21, 2025",
        time: "10:15 AM",
        note: "User confirmed detected information",
      },
      {
        event: "Demand letter sent",
        date: "Feb 22, 2025",
        time: "2:00 PM",
        note: "Letter sent to landlord",
      },
      {
        event: "Case resolved",
        date: "Feb 23, 2025",
        time: "11:01 AM",
        note: "Deposit returned plus damages",
      },
    ],
    financialSummary: {
      total: "$1,100",
      breakdown: [
        { label: "Deposit Returned", amount: "$800", color: "mint" },
        { label: "Damages", amount: "$300", color: "mint" },
      ],
    },
  },
};

export const mockResults = {
  1: {
    documentId: 1,
    documentTitle: "Lease – 123 Main St",
    documentType: "Lease",
    estimatedRecovery: "$3,250",
    issuesFound: 3,
    overallRisk: "Medium",
    riskColor: "severity-medium",
    keyResults: [
      {
        category: "Deposits & Fees",
        icon: "💰",
        text: "Your security deposit may be held too long.",
        amount: "$1,500 at risk",
        color: "from-peach-400 to-coral-400",
      },
      {
        category: "Late Fees / Extra Charges",
        icon: "💸",
        text: "We found potential issues with late fee charges.",
        amount: "$200 in questionable fees",
        color: "from-coral-400 to-orchid-400",
      },
      {
        category: "Timeline Concerns",
        icon: "📅",
        text: "The move-out timeline and deposit return date may violate state rules.",
        amount: "45 days overdue",
        color: "from-gold-400 to-peach-400",
      },
    ],
    findingsPreview: [
      {
        id: 1,
        title: "Security deposit held more than 30 days",
        severity: "high",
        summary: "Landlord failed to return deposit within the legal timeframe",
        severityColor: "severity-high",
      },
      {
        id: 2,
        title: "Illegal late fee amount",
        severity: "medium",
        summary: "Late fee exceeds 5% of monthly rent or $30",
        severityColor: "severity-medium",
      },
      {
        id: 3,
        title: "Non-refundable administrative fee",
        severity: "high",
        summary: "Non-refundable fee may violate security deposit law",
        severityColor: "severity-high",
      },
    ],
  },
  2: {
    documentId: 2,
    documentTitle: "Hospital Bill – Baystate Medical",
    documentType: "Medical Bill",
    estimatedRecovery: "$780",
    issuesFound: 2,
    overallRisk: "Low",
    riskColor: "severity-low",
    keyResults: [
      {
        category: "Billing Errors",
        icon: "💸",
        text: "We found potential overcharges in your medical bill.",
        amount: "$500 in potential overcharges",
        color: "from-coral-400 to-orchid-400",
      },
      {
        category: "Itemization Issues",
        icon: "📋",
        text: "The bill lacks clear itemization as required by law.",
        amount: "$280 in unclear charges",
        color: "from-gold-400 to-peach-400",
      },
    ],
    findingsPreview: [
      {
        id: 1,
        title: "Unclear itemization of charges",
        severity: "medium",
        summary: "Bill does not clearly break down all charges and services",
        severityColor: "severity-medium",
      },
      {
        id: 2,
        title: "Potential billing code errors",
        severity: "low",
        summary: "Some charges may be incorrectly coded",
        severityColor: "severity-low",
      },
    ],
  },
};

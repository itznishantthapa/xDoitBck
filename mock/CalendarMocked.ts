export type MetaAssignment = {
  id: number;
  metaAssignmentName: string;
};

export type CalendarDateMeta = {
  date: string;
  isDelivery: boolean;
  isDelivered: boolean;
  metaAssignments: MetaAssignment[];
};

export type CalendarData = {
  bookedDates: string[];
  calendarDateMeta: CalendarDateMeta[];
};

export const calendarData: CalendarData = {
  bookedDates: [
    "2026-06-05",
    "2026-06-12",
    "2026-06-13",
    "2026-06-22",
    "2026-06-27",
  ],

  calendarDateMeta: [
    {
      date: "2026-06-12",
      isDelivery: true,
      isDelivered: true,
      metaAssignments: [
        { id: 1, metaAssignmentName: "Ecommerce Presentation" },
        { id: 2, metaAssignmentName: "Ecommerce Case Study" },
        { id: 7, metaAssignmentName: "Product Launch Presentation" },
      ],
    },
    {
      date: "2026-06-05",
      isDelivery: false,
      isDelivered: true,
      metaAssignments: [
        { id: 3, metaAssignmentName: "Leadership Reflection Essay" },
      ],
    },
    {
      date: "2026-06-10",
      isDelivery: false,
      isDelivered: true,
      metaAssignments: [
        { id: 4, metaAssignmentName: "Financial Analysis Report" },
      ],
    },
    {
      date: "2026-06-15",
      isDelivery: false,
      isDelivered: true,
      metaAssignments: [
        { id: 5, metaAssignmentName: "Brand Identity Project" },
      ],
    },
    {
      date: "2026-06-20",
      isDelivery: false,
      isDelivered: true,
      metaAssignments: [
        { id: 6, metaAssignmentName: "Quarterly Sales Report" },
      ],
    },
    {
      date: "2026-07-06",
      isDelivery: true,
      isDelivered: false,
      metaAssignments: [
        { id: 8, metaAssignmentName: "Machine Learning Essay" },
      ],
    },
    {
      date: "2026-07-15",
      isDelivery: true,
      isDelivered: false,
      metaAssignments: [
        { id: 9, metaAssignmentName: "Investor Update Presentation" },
      ],
    },
    {
      date: "2026-07-20",
      isDelivery: true,
      isDelivered: false,
      metaAssignments: [
        { id: 10, metaAssignmentName: "UX Research Project" },
      ],
    },
    {
      date: "2026-07-25",
      isDelivery: true,
      isDelivered: false,
      metaAssignments: [
        { id: 11, metaAssignmentName: "Operations Audit Report" },
      ],
    },
  ],
};

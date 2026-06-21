import { useState } from "react";
import {
  Typography,
  Chip,
  Avatar,
  Tooltip,
} from "@mui/material";
import {
  CalendarMonth,
  CheckCircle,
  Cancel,
  HowToReg,
  AttachMoney,
  TrendingUp,
  Percent,
  AccessTime,
  ArrowForward,
  AddBox,
  PersonAdd,
  Message,
  Assessment,
  PeopleAlt,
} from "@mui/icons-material";
import { Link } from "react-router";
import { useGetAllAppointmentByDateQuery } from "../../redux/api/appointment";
import { useGetAppointmentDailyReportByDateQuery } from "../../redux/api/report";
import { useCurrentUser } from "../../redux/features/authSlice";
import { useAppSelector } from "../../redux/hooks";
import type { TAppointment } from "../../types/User";

type Status = "BOOKED" | "PRESENT" | "ABSENT" | "VISITED";

export default function Dashboard() {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  // Get current user details for greeting
  const user = useAppSelector(useCurrentUser);
  const isDoctor = user?.role?.includes("DOCTOR");
  const greetingName = user?.name
    ? isDoctor && !user.name.toLowerCase().startsWith("dr.")
      ? `Dr. ${user.name}`
      : user.name
    : "Doctor";

  // Fetch appointments for selected date
  const { data: appointments, isLoading: isLoadingAppointments } =
    useGetAllAppointmentByDateQuery(selectedDate, {
      refetchOnMountOrArgChange: true,
    });

  // Fetch daily report for selected date
  const { data: dailyReport } = useGetAppointmentDailyReportByDateQuery(
    selectedDate,
    {
      skip: !selectedDate,
      refetchOnMountOrArgChange: true,
    }
  );

  const allData: TAppointment[] = appointments?.data ?? [];

  // Calculate status counts
  const counts: Record<Status, number> = {
    BOOKED: allData.filter((i) => (i.status ?? "BOOKED") === "BOOKED").length,
    PRESENT: allData.filter((i) => i.status === "PRESENT").length,
    ABSENT: allData.filter((i) => i.status === "ABSENT").length,
    VISITED: allData.filter((i) => i.status === "VISITED").length,
  };

  // Calculate daily report financial statistics
  const categories = [
    "NewPatientFemale",
    "NewPatientMale",
    "OldPatientFemale",
    "OldPatientMale",
  ];

  const reportTotals = categories.reduce(
    (acc, cat) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const catData = (dailyReport as any)?.data?.[cat] || (dailyReport as any)?.[cat] || {};
      const visitingAmount = Number(catData.TotalVisitingAmount ?? 0);
      const connectorAmount = Number(catData.TotalConnectorAmount ?? 0);
      const discount = Number(catData.TotalDiscount ?? 0);

      acc.TotalConnector += Number(catData.TotalConnector ?? 0);
      acc.TotalConnectorAmount += connectorAmount;
      acc.TotalDiscount += discount;
      acc.TotalPatient += Number(catData.TotalPatient ?? 0);
      acc.TotalVisitingAmount += visitingAmount;
      acc.TotalAmount += visitingAmount - connectorAmount - discount;
      return acc;
    },
    {
      TotalConnector: 0,
      TotalConnectorAmount: 0,
      TotalDiscount: 0,
      TotalPatient: 0,
      TotalVisitingAmount: 0,
      TotalAmount: 0,
    }
  );

  // Calculate payment statistics
  const paidCount = allData.filter((i) => i.paymentStatus === "PAID").length;
  const unpaidCount = allData.filter(
    (i) => i.paymentStatus === "UNPAID" || i.paymentStatus === "PARTIALLY_PAID"
  ).length;
  const totalPaidUnpaid = paidCount + unpaidCount;
  const paidPercentage =
    totalPaidUnpaid > 0 ? Math.round((paidCount / totalPaidUnpaid) * 100) : 0;

  // Format date for visual presentation
  const formattedDisplayDate = new Date(selectedDate).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 px-4 py-2">
      {/* Header & Date Picker Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-xs transition-all duration-300 hover:shadow-md">
        <div>
          <Typography
            variant="h4"
            className="text-2xl lg:text-3xl font-extrabold text-slate-800 tracking-tight"
            sx={{ fontFamily: "Outfit, sans-serif" }}
          >
            Hello, {greetingName} 👋
          </Typography>
          <Typography className="text-slate-500 text-sm mt-1">
            Welcome to the Clinic Panel. Here is your practice overview for{" "}
            <span className="font-semibold text-slate-700">{formattedDisplayDate}</span>.
          </Typography>
        </div>

        <div className="flex items-center gap-3 bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 px-4 py-2.5 rounded-xl transition-all duration-200 cursor-pointer self-start lg:self-center">
          <CalendarMonth className="text-slate-500 text-lg" />
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Select Practice Date
            </span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent border-none outline-hidden font-semibold text-sm text-slate-700 cursor-pointer w-[130px]"
            />
          </div>
        </div>
      </div>

      {/* Appointment Status Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Booked Appointments */}
        <div className="group relative overflow-hidden bg-gradient-to-br from-amber-50/80 to-amber-100/20 border border-amber-200/50 p-6 rounded-2xl shadow-xs transition-all duration-300 hover:scale-[1.02] hover:shadow-md hover:border-amber-300">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <Typography className="text-xs font-bold text-amber-700/80 uppercase tracking-wider">
                Booked Appointments
              </Typography>
              <Typography className="text-3xl font-extrabold text-amber-900">
                {counts.BOOKED}
              </Typography>
            </div>
            <div className="p-3 bg-amber-500/10 text-amber-600 rounded-xl group-hover:bg-amber-500/20 transition-colors">
              <CalendarMonth className="text-xl" />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-amber-700/90 font-medium">
            <span>Awaiting arrival</span>
            <span className="bg-amber-500/10 px-2 py-0.5 rounded-full font-semibold">
              Today
            </span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-200 group-hover:bg-amber-400 transition-colors" />
        </div>

        {/* Present / Checked-In */}
        <div className="group relative overflow-hidden bg-gradient-to-br from-emerald-50/80 to-emerald-100/20 border border-emerald-200/50 p-6 rounded-2xl shadow-xs transition-all duration-300 hover:scale-[1.02] hover:shadow-md hover:border-emerald-300">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <Typography className="text-xs font-bold text-emerald-700/80 uppercase tracking-wider">
                Checked-In / Waiting
              </Typography>
              <Typography className="text-3xl font-extrabold text-emerald-900">
                {counts.PRESENT}
              </Typography>
            </div>
            <div className="p-3 bg-emerald-500/10 text-emerald-600 rounded-xl group-hover:bg-emerald-500/20 transition-colors">
              <HowToReg className="text-xl" />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-emerald-700/90 font-medium">
            <span>At the clinic</span>
            <span className="bg-emerald-500/10 px-2 py-0.5 rounded-full font-semibold">
              Active
            </span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-200 group-hover:bg-emerald-400 transition-colors" />
        </div>

        {/* Visited / Completed */}
        <div className="group relative overflow-hidden bg-gradient-to-br from-blue-50/80 to-blue-100/20 border border-blue-200/50 p-6 rounded-2xl shadow-xs transition-all duration-300 hover:scale-[1.02] hover:shadow-md hover:border-blue-300">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <Typography className="text-xs font-bold text-blue-700/80 uppercase tracking-wider">
                Completed Visits
              </Typography>
              <Typography className="text-3xl font-extrabold text-blue-900">
                {counts.VISITED}
              </Typography>
            </div>
            <div className="p-3 bg-blue-500/10 text-blue-600 rounded-xl group-hover:bg-blue-500/20 transition-colors">
              <CheckCircle className="text-xl" />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-blue-700/90 font-medium">
            <span>Consultation done</span>
            <span className="bg-blue-500/10 px-2 py-0.5 rounded-full font-semibold">
              Finished
            </span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-200 group-hover:bg-blue-400 transition-colors" />
        </div>

        {/* Absent / No-Show */}
        <div className="group relative overflow-hidden bg-gradient-to-br from-rose-50/80 to-rose-100/20 border border-rose-200/50 p-6 rounded-2xl shadow-xs transition-all duration-300 hover:scale-[1.02] hover:shadow-md hover:border-rose-300">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <Typography className="text-xs font-bold text-rose-700/80 uppercase tracking-wider">
                Absent / No-Show
              </Typography>
              <Typography className="text-3xl font-extrabold text-rose-900">
                {counts.ABSENT}
              </Typography>
            </div>
            <div className="p-3 bg-rose-500/10 text-rose-600 rounded-xl group-hover:bg-rose-500/20 transition-colors">
              <Cancel className="text-xl" />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-rose-700/90 font-medium">
            <span>Missed appointments</span>
            <span className="bg-rose-500/10 px-2 py-0.5 rounded-full font-semibold">
              Unattended
            </span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-rose-200 group-hover:bg-rose-400 transition-colors" />
        </div>
      </div>

      {/* Financial & Operational Summary */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
        <div className="flex items-center gap-2 mb-5">
          <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-md">
            <TrendingUp className="text-sm" />
          </div>
          <Typography className="text-base font-bold text-slate-800">
            Daily Financial Overview
          </Typography>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Gross Revenue */}
          <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors">
            <div className="p-3 bg-teal-50 text-teal-600 rounded-lg">
              <AttachMoney />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                Gross visiting Fee
              </span>
              <Typography className="text-lg font-bold text-slate-700 mt-0.5">
                ৳{reportTotals.TotalVisitingAmount.toLocaleString()}
              </Typography>
            </div>
          </div>


          {/* Total Discount */}
          <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
              <Percent />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                Total Discounts
              </span>
              <Typography className="text-lg font-bold text-slate-700 mt-0.5">
                ৳{reportTotals.TotalDiscount.toLocaleString()}
              </Typography>
            </div>
          </div>

          {/* Net Earnings */}
          <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors bg-gradient-to-r from-slate-50 to-indigo-50/30 border border-slate-100 rounded-xl">
            <div className="p-3 bg-indigo-500 text-white rounded-lg shadow-sm">
              <TrendingUp />
            </div>
            <div>
              <span className="text-xs text-indigo-600/80 font-bold uppercase tracking-wider">
                Net visiting fee
              </span>
              <Typography className="text-lg font-extrabold text-indigo-900 mt-0.5">
                ৳{reportTotals.TotalAmount.toLocaleString()}
              </Typography>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Columns (lg:col-span-2) - Patient list for selected date */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-xs p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-50 text-blue-600 rounded-md">
                  <PeopleAlt className="text-sm" />
                </div>
                <Typography className="text-base font-bold text-slate-800">
                  Appointment Roster Summary
                </Typography>
              </div>
              <Link to="/dashboard/patient-list" className="no-underline">
                <button className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-bold bg-blue-50/50 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors cursor-pointer border-none outline-hidden">
                  Manage Roster <ArrowForward className="text-xs" />
                </button>
              </Link>
            </div>

            {isLoadingAppointments ? (
              <div className="py-20 flex justify-center items-center">
                <span className="text-slate-400 font-medium text-sm animate-pulse">
                  Loading appointments...
                </span>
              </div>
            ) : allData.length === 0 ? (
              <div className="py-16 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-3">
                  <CalendarMonth className="text-3xl" />
                </div>
                <Typography className="text-sm font-bold text-slate-700">
                  No Appointments Scheduled
                </Typography>
                <Typography className="text-xs text-slate-400 max-w-[280px] mt-1">
                  There are no appointments registered for {formattedDisplayDate}.
                </Typography>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-semibold text-xs uppercase bg-slate-50/80">
                      <th className="py-2.5 px-3 rounded-l-lg">Patient</th>
                      <th className="py-2.5 px-2">Type</th>
                      <th className="py-2.5 px-2">Time</th>
                      <th className="py-2.5 px-2">Status</th>
                      <th className="py-2.5 px-3 rounded-r-lg text-right">Payment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allData.slice(0, 6).map((app) => {
                      const initial = app.patientInfo?.name
                        ? app.patientInfo.name.charAt(0).toUpperCase()
                        : "P";

                      // Status color mappings
                      const statusConfig: Record<
                        Status,
                        { label: string; bg: string; text: string }
                      > = {
                        BOOKED: {
                          label: "Booked",
                          bg: "bg-amber-50",
                          text: "text-amber-700 border border-amber-200/50",
                        },
                        PRESENT: {
                          label: "Present",
                          bg: "bg-emerald-50",
                          text: "text-emerald-700 border border-emerald-200/50",
                        },
                        ABSENT: {
                          label: "Absent",
                          bg: "bg-rose-50",
                          text: "text-rose-700 border border-rose-200/50",
                        },
                        VISITED: {
                          label: "Visited",
                          bg: "bg-blue-50",
                          text: "text-blue-700 border border-blue-200/50",
                        },
                      };

                      const currentStatus = (app.status ?? "BOOKED") as Status;
                      const stat = statusConfig[currentStatus] || statusConfig.BOOKED;

                      return (
                        <tr
                          key={app.id}
                          className="border-b border-slate-100 hover:bg-slate-50/60 transition-colors last:border-b-0"
                        >
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-3">
                              <Avatar
                                sx={{
                                  width: 30,
                                  height: 30,
                                  fontSize: "0.85rem",
                                  fontWeight: 700,
                                  bgcolor:
                                    currentStatus === "VISITED"
                                      ? "#dbeafe"
                                      : currentStatus === "PRESENT"
                                        ? "#d1fae5"
                                        : "#fef3c7",
                                  color:
                                    currentStatus === "VISITED"
                                      ? "#1e40af"
                                      : currentStatus === "PRESENT"
                                        ? "#065f46"
                                        : "#92400e",
                                }}
                              >
                                {initial}
                              </Avatar>
                              <div>
                                <span className="font-bold text-slate-800 block text-xs md:text-sm">
                                  {app.patientInfo?.name ?? "—"}
                                </span>
                                <span className="text-[11px] text-slate-400 block mt-0.5">
                                  {app.patientInfo?.contactNumber ?? "—"}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-2">
                            <Chip
                              label={app.patientType}
                              size="small"
                              className="font-bold text-[10px]"
                              color={app.patientType === "NEW" ? "info" : "default"}
                              variant="outlined"
                              sx={{ height: 18, fontSize: 10 }}
                            />
                          </td>
                          <td className="py-3 px-2">
                            <div className="flex items-center gap-1 text-slate-500 text-xs">
                              <AccessTime className="text-[14px]" />
                              <span>{app.visitingTime ?? "N/A"}</span>
                            </div>
                          </td>
                          <td className="py-3 px-2">
                            <span
                              className={`px-2 py-0.5 rounded-md text-[11px] font-bold inline-block ${stat.bg} ${stat.text}`}
                            >
                              {stat.label}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <Chip
                              label={app.paymentStatus ?? "UNPAID"}
                              size="small"
                              className="font-bold text-[10px] uppercase"
                              color={app.paymentStatus === "PAID" ? "success" : "error"}
                              sx={{ height: 18, fontSize: 9 }}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {allData.length > 6 && (
            <div className="border-t border-slate-100 pt-3 text-center">
              <Typography className="text-xs text-slate-400 font-medium">
                Showing top 6 of {allData.length} appointments for this date.
              </Typography>
            </div>
          )}
        </div>

        {/* Right Column (lg:col-span-1) - Quick Actions & Insights */}
        <div className="space-y-6">
          {/* Quick Actions Panel */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6">
            <Typography className="text-base font-bold text-slate-800 mb-4">
              Quick Operations
            </Typography>

            <div className="grid grid-cols-2 gap-3">
              {/* Add Appointment */}
              <Link to="/dashboard/appointment" className="no-underline">
                <div className="flex flex-col items-center justify-center p-4 bg-blue-50/40 hover:bg-blue-50 border border-blue-100 rounded-xl transition-all text-center cursor-pointer group h-[105px]">
                  <div className="p-2 bg-blue-500 text-white rounded-lg shadow-sm group-hover:scale-110 transition-transform">
                    <AddBox className="text-lg" />
                  </div>
                  <span className="text-[11px] font-bold text-blue-900 mt-2 block">
                    Book Appointment
                  </span>
                </div>
              </Link>

              {/* Register Patient */}
              <Link to="/dashboard/patient-management" className="no-underline">
                <div className="flex flex-col items-center justify-center p-4 bg-emerald-50/40 hover:bg-emerald-50 border border-emerald-100 rounded-xl transition-all text-center cursor-pointer group h-[105px]">
                  <div className="p-2 bg-emerald-500 text-white rounded-lg shadow-sm group-hover:scale-110 transition-transform">
                    <PersonAdd className="text-lg" />
                  </div>
                  <span className="text-[11px] font-bold text-emerald-900 mt-2 block">
                    Register Patient
                  </span>
                </div>
              </Link>

              {/* Send SMS Alert */}
              <Link to="/dashboard/send-sms" className="no-underline">
                <div className="flex flex-col items-center justify-center p-4 bg-purple-50/40 hover:bg-purple-50 border border-purple-100 rounded-xl transition-all text-center cursor-pointer group h-[105px]">
                  <div className="p-2 bg-purple-500 text-white rounded-lg shadow-sm group-hover:scale-110 transition-transform">
                    <Message className="text-lg" />
                  </div>
                  <span className="text-[11px] font-bold text-purple-900 mt-2 block">
                    Send SMS Reminder
                  </span>
                </div>
              </Link>

              {/* View Daily Report */}
              <Link to="/dashboard/report/daily-report" className="no-underline">
                <div className="flex flex-col items-center justify-center p-4 bg-amber-50/40 hover:bg-amber-50 border border-amber-100 rounded-xl transition-all text-center cursor-pointer group h-[105px]">
                  <div className="p-2 bg-amber-500 text-white rounded-lg shadow-sm group-hover:scale-110 transition-transform">
                    <Assessment className="text-lg" />
                  </div>
                  <span className="text-[11px] font-bold text-amber-900 mt-2 block">
                    Daily Report
                  </span>
                </div>
              </Link>
            </div>
          </div>

          {/* Practice Analytics Card */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6">
            <Typography className="text-base font-bold text-slate-800 mb-1">
              Ratios & Performance
            </Typography>
            <Typography className="text-[11px] text-slate-400 font-medium mb-4">
              Breakdown for the selected date
            </Typography>

            <div className="space-y-5">
              {/* Payment Ratio Progress */}
              <div className="flex items-center gap-4 border-b border-slate-50 pb-4">
                {/* SVG Circular Progress Ring */}
                <div className="relative w-14 h-14 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-slate-100"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-emerald-500 transition-all duration-500 ease-out"
                      strokeDasharray={`${paidPercentage}, 100`}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute text-[11px] font-extrabold text-slate-700">
                    {paidPercentage}%
                  </div>
                </div>

                <div>
                  <Typography className="text-xs font-bold text-slate-800">
                    Payment Collection Rate
                  </Typography>
                  <Typography className="text-[11px] text-slate-400 mt-0.5">
                    {paidCount} of {totalPaidUnpaid} paid appointments.
                  </Typography>
                </div>
              </div>

              {/* Status breakdown bars */}
              <div className="space-y-3">
                <Typography className="text-xs font-bold text-slate-500">
                  Appointment Ratios
                </Typography>

                {/* Progress bar stack */}
                <div className="h-3 w-full bg-slate-100 rounded-full flex overflow-hidden">
                  {allData.length > 0 ? (
                    <>
                      <Tooltip title={`Visited: ${counts.VISITED}`} arrow>
                        <div
                          style={{
                            width: `${(counts.VISITED / allData.length) * 100}%`,
                          }}
                          className="bg-blue-500 h-full"
                        />
                      </Tooltip>
                      <Tooltip title={`Present: ${counts.PRESENT}`} arrow>
                        <div
                          style={{
                            width: `${(counts.PRESENT / allData.length) * 100}%`,
                          }}
                          className="bg-emerald-500 h-full"
                        />
                      </Tooltip>
                      <Tooltip title={`Booked: ${counts.BOOKED}`} arrow>
                        <div
                          style={{
                            width: `${(counts.BOOKED / allData.length) * 100}%`,
                          }}
                          className="bg-amber-400 h-full"
                        />
                      </Tooltip>
                      <Tooltip title={`Absent: ${counts.ABSENT}`} arrow>
                        <div
                          style={{
                            width: `${(counts.ABSENT / allData.length) * 100}%`,
                          }}
                          className="bg-rose-500 h-full"
                        />
                      </Tooltip>
                    </>
                  ) : (
                    <div className="w-full bg-slate-200 h-full" />
                  )}
                </div>

                {/* Legend */}
                <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500 font-semibold mt-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 bg-blue-500 rounded-xs block" />
                    <span>Completed ({counts.VISITED})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 bg-emerald-500 rounded-xs block" />
                    <span>Checked-in ({counts.PRESENT})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 bg-amber-400 rounded-xs block" />
                    <span>Booked ({counts.BOOKED})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 bg-rose-500 rounded-xs block" />
                    <span>Absent ({counts.ABSENT})</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

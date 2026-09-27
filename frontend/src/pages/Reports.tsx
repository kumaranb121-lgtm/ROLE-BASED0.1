import { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import api from '../services/api';
import { BarChart3, Users, Clock, AlertTriangle, FileText } from 'lucide-react';

export default function Reports() {
  const { user } = useAuthStore();
  const [report, setReport] = useState<any>(null);
  const [studentAbsentees, setStudentAbsentees] = useState<any[]>([]);

  useEffect(() => {
    if (user?.role === 'HOD') {
      api.get('/reports').then(res => setReport(res.data)).catch(console.error);
      api.get('/attendance').then(res => {
        const absenteesData = (res.data || []).filter((a: any) => a.absentCount > 0);
        setStudentAbsentees(absenteesData);
      }).catch(console.error);
    }
  }, [user]);

  if (user?.role !== 'HOD') {
    return (
      <div className="flex flex-col items-center justify-center h-[600px] text-[#01949a]/50">
        <AlertTriangle className="w-16 h-16 mb-4" />
        <h2 className="text-xl font-bold text-[#017a80]">Access Denied</h2>
        <p className="font-medium">Only the HOD can view department reports.</p>
      </div>
    );
  }

  if (!report) {
    return <div className="text-center py-20 text-[#01949a] font-bold">Loading Reports...</div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-[1200px] mx-auto pb-10">
      <div className="flex items-center gap-4 bg-white p-6 rounded-2xl border border-[#dbe8d8] shadow-sm">
        <div className="p-3 bg-[#f4f8f3] rounded-full text-[#01949a]">
          <BarChart3 className="w-8 h-8 stroke-[1.5]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#017a80]">Department Overview</h1>
          <p className="text-[#01949a]/70 font-medium mt-1">Key metrics and statistics</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-[#dbe8d8] shadow-sm flex items-center gap-4">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-full">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-[#01949a]/60 uppercase tracking-wider">Total Staff</p>
            <h3 className="text-3xl font-bold text-[#017a80]">{report.totalStaff}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#dbe8d8] shadow-sm flex items-center gap-4">
          <div className="p-4 bg-amber-50 text-amber-600 rounded-full">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-[#01949a]/60 uppercase tracking-wider">Pending Leaves</p>
            <h3 className="text-3xl font-bold text-[#017a80]">{report.pendingLeaves}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#dbe8d8] shadow-sm flex items-center gap-4">
          <div className="p-4 bg-purple-50 text-purple-600 rounded-full">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-[#01949a]/60 uppercase tracking-wider">Total Subs</p>
            <h3 className="text-3xl font-bold text-[#017a80]">{report.totalSubstitutions}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#dbe8d8] shadow-sm flex items-center gap-4">
          <div className="p-4 bg-red-50 text-slate-600 rounded-full">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-[#01949a]/60 uppercase tracking-wider">Recent Absentees</p>
            <h3 className="text-3xl font-bold text-[#017a80]">{report.recentAbsentTotal}</h3>
          </div>
        </div>
      </div>

      {/* Student Absentees Report Table */}
      <div className="bg-white rounded-2xl border border-[#dbe8d8] shadow-sm overflow-hidden mt-8">
        <div className="p-6 border-b border-[#dbe8d8] flex justify-between items-center bg-[#f4f8f3]">
          <h2 className="text-lg font-bold flex items-center gap-2 border-l-4 border-[#01949a] pl-3 text-[#017a80]">
            Detailed Student Absentees Report
          </h2>
        </div>
        <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
          <table className="w-full text-sm text-left relative">
            <thead className="bg-[#f4f8f3] text-[#01949a] font-bold text-xs uppercase sticky top-0 shadow-sm border-b border-[#dbe8d8]">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Year/Class</th>
                <th className="px-6 py-4">Period & Staff</th>
                <th className="px-6 py-4">Absent Count</th>
                <th className="px-6 py-4">Absent Roll Nos</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#dbe8d8]/50">
              {studentAbsentees.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-[#01949a]/60 font-medium">No student absentees recorded</td>
                </tr>
              ) : studentAbsentees.map((att, i) => (
                <tr key={att._id || i} className="hover:bg-[#f4f8f3]/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-[#017a80]">
                    {new Date(att.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 font-bold text-[#017a80]">
                    {att.classId}
                  </td>
                  <td className="px-6 py-4 text-[#01949a]/80 font-medium">
                    {att.timetableSlot}<br/>
                    <span className="text-[11px] text-[#01949a]/60">By: {att.markedBy?.name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-md text-[12px] font-bold bg-red-100 text-red-700 border border-red-200">
                      {att.absentCount}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[#01949a]/80 text-[11px]">
                    {att.absentRollNos?.join(', ') || 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

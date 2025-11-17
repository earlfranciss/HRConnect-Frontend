import { FileCheck } from "lucide-react";

export default function ApprovedRequestCard({ className }: { className?: string }) {
  return (
    <div className={`p-[25px] bg-white border border-gray-200 rounded-lg ${className || "w-full"}`}>
            <div className="flex items-center gap-2 mb-4">
                <div className="size-9 rounded-lg bg-green-50 flex items-center justify-center">
                    <FileCheck className="text-[#1CAA3A]" />
                </div>
                <h2 className="font-['Segoe_UI'] font-bold text-gray-900">Approved Requests</h2>
                <span className="ml-auto px-[10px] py-[2px] rounded-full bg-green-50 font-['Segoe_UI'] font-bold text-[11.6px] text-gray-700">3</span>
            </div>
            <div className="max-h-[250px] overflow-y-auto">
                {[
                    { title: 'Leave Request', submitted: 'Nov 20', approver: 'John Smith' },
                    { title: 'Reimbursement', submitted: 'Nov 18', approver: 'Finance Team' },
                    { title: 'WFH Request', submitted: 'Nov 22', approver: 'Manager' }
                ].map((req, i) => (
                    <div key={i} className="flex justify-between p-[13px] bg-gray-50 border border-gray-100 rounded-lg mb-3 last:mb-0 gap-15">
                        <div>
                        <div className="font-['Segoe_UI'] font-semibold text-sm text-gray-900 mb-2 pr-20">{req.title}</div>
                        <div className="font-['Segoe_UI'] font-semibold text-[11.6px] text-gray-500 mb-1">Submitted: {req.submitted}</div>
                        <div className="font-['Segoe_UI'] font-semibold text-[11.6px] text-gray-500">Approver: {req.approver}</div>
                        </div>
                        <p className=" px-[3px] rounded-full font-['Segoe_UI'] font-bold text-xs text-green-500">Approved</p>
                    </div>
                ))}
            </div>
        </div>
    )
}
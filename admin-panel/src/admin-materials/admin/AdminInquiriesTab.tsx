
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader2, MessageSquare, Edit, Trash2, UserPlus } from "lucide-react";
import { useAdminInquiriesQuery, useUpdateInquiryStatus, useUpdateInquiryNotes, useAssignInquiry, useDeleteInquiry, InquiryWithListing } from "@/hooks/useAdminInquiries";
import { Database } from '@/integrations/supabase/types';
import { formatDistanceToNow } from "date-fns";

type InquiryStatus = Database['public']['Enums']['inquiry_status'];

const AdminInquiriesTab = () => {
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryWithListing | null>(null);
  const [notesDialog, setNotesDialog] = useState(false);
  const [assignDialog, setAssignDialog] = useState(false);
  const [notes, setNotes] = useState('');
  const [assignedTo, setAssignedTo] = useState('');

  const { data: inquiries, isLoading: inquiriesLoading } = useAdminInquiriesQuery();
  const updateInquiryStatus = useUpdateInquiryStatus();
  const updateInquiryNotes = useUpdateInquiryNotes();
  const assignInquiry = useAssignInquiry();
  const deleteInquiry = useDeleteInquiry();

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      new: "bg-blue-100 text-blue-800",
      contacted: "bg-yellow-100 text-yellow-800",
      converted: "bg-green-100 text-green-800",
      closed: "bg-gray-100 text-gray-800"
    };
    return variants[status] || variants.new;
  };

  const handleStatusUpdate = (inquiryId: string, newStatus: InquiryStatus) => {
    updateInquiryStatus.mutate({ id: inquiryId, status: newStatus });
  };

  const handleNotesUpdate = async () => {
    if (selectedInquiry) {
      await updateInquiryNotes.mutateAsync({ id: selectedInquiry.id, notes });
      setNotesDialog(false);
      setNotes('');
      setSelectedInquiry(null);
    }
  };

  const handleAssignInquiry = async () => {
    if (selectedInquiry && assignedTo) {
      await assignInquiry.mutateAsync({ id: selectedInquiry.id, assigned_to: assignedTo });
      setAssignDialog(false);
      setAssignedTo('');
      setSelectedInquiry(null);
    }
  };

  const handleDeleteInquiry = async (inquiryId: string) => {
    try {
      await deleteInquiry.mutateAsync(inquiryId);
    } catch (error) {
      console.error('Delete inquiry error:', error);
    }
  };

  const openNotesDialog = (inquiry: InquiryWithListing) => {
    setSelectedInquiry(inquiry);
    setNotes(inquiry.notes || '');
    setNotesDialog(true);
  };

  const openAssignDialog = (inquiry: InquiryWithListing) => {
    setSelectedInquiry(inquiry);
    setAssignedTo(inquiry.assigned_to || '');
    setAssignDialog(true);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Manage Inquiries</CardTitle>
        </CardHeader>
        <CardContent>
          {inquiriesLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mr-2" />
              <span>Loading inquiries...</span>
            </div>
          ) : inquiries && inquiries.length > 0 ? (
            <div className="space-y-4">
              {inquiries.map((inquiry: InquiryWithListing) => (
                <div key={inquiry.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{inquiry.name}</h3>
                        <Badge className={getStatusBadge(inquiry.status)}>
                          {inquiry.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{inquiry.email}</p>
                      {inquiry.phone && (
                        <p className="text-sm text-gray-600">{inquiry.phone}</p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => openNotesDialog(inquiry)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => openAssignDialog(inquiry)}
                      >
                        <UserPlus className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Inquiry</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this inquiry from {inquiry.name}? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteInquiry(inquiry.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-700 mb-3">{inquiry.message}</p>
                  
                  {inquiry.listings && (
                    <p className="text-sm text-blue-600 mb-2">
                      Property: {inquiry.listings.address}
                    </p>
                  )}
                  
                  {inquiry.notes && (
                    <div className="bg-gray-50 p-2 rounded text-sm mb-2">
                      <strong>Notes:</strong> {inquiry.notes}
                    </div>
                  )}
                  
                  {inquiry.assigned_to && (
                    <p className="text-sm text-purple-600 mb-2">
                      Assigned to: {inquiry.assigned_to}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(inquiry.created_at), { addSuffix: true })}
                    </span>
                    <div className="flex space-x-2">
                      {inquiry.status === 'new' && (
                        <Button 
                          size="sm" 
                          onClick={() => handleStatusUpdate(inquiry.id, 'contacted' as InquiryStatus)}
                          disabled={updateInquiryStatus.isPending}
                        >
                          Mark Contacted
                        </Button>
                      )}
                      {inquiry.status === 'contacted' && (
                        <Button 
                          size="sm" 
                          onClick={() => handleStatusUpdate(inquiry.id, 'converted' as InquiryStatus)}
                          disabled={updateInquiryStatus.isPending}
                        >
                          Mark Converted
                        </Button>
                      )}
                      {(inquiry.status === 'new' || inquiry.status === 'contacted') && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleStatusUpdate(inquiry.id, 'closed' as InquiryStatus)}
                          disabled={updateInquiryStatus.isPending}
                        >
                          Close
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No inquiries found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notes Dialog */}
      <Dialog open={notesDialog} onOpenChange={setNotesDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Notes - {selectedInquiry?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about this inquiry..."
              rows={4}
            />
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setNotesDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleNotesUpdate} disabled={updateInquiryNotes.isPending}>
                Save Notes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Assign Dialog */}
      <Dialog open={assignDialog} onOpenChange={setAssignDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Inquiry - {selectedInquiry?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Select value={assignedTo} onValueChange={setAssignedTo}>
              <SelectTrigger>
                <SelectValue placeholder="Select agent to assign" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="agent1@example.com">Agent 1</SelectItem>
                <SelectItem value="agent2@example.com">Agent 2</SelectItem>
                <SelectItem value="agent3@example.com">Agent 3</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setAssignDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAssignInquiry} disabled={assignInquiry.isPending}>
                Assign
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminInquiriesTab;

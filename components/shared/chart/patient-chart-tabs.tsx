"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  IconBuildingHospital,
  IconHistory,
  IconPill,
  IconFileText,
  IconChartBar,
  IconPlus,
  IconCheck,
  IconX,
  IconAlertCircle,
  IconClock
} from '@tabler/icons-react';
import { UserRole } from "@/lib/auth/roles";

interface PatientChartTabsProps {
  patientData: any;
  role: UserRole;
  staffId: string; // Current logged-in staff ID
}

export function PatientChartTabs({ patientData, role, staffId }: PatientChartTabsProps) {
  const [clinicalNotes, setClinicalNotes] = useState<any[]>([]);
  const [flowsheetObs, setFlowsheetObs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Clinical Note Form States
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    noteType: 'NURSING_NOTE',
    cosignerId: '',
  });

  // Flowsheet Form States
  const [flowsheetDialogOpen, setFlowsheetDialogOpen] = useState(false);
  const [newObservation, setNewObservation] = useState({
    observationType: 'HEART_RATE',
    value: '',
    unit: 'BPM',
  });

  // Medical History Form States
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [newHistory, setNewHistory] = useState({
    type: 'MEDICAL_HISTORY',
    entry: '',
    icd10Code: '',
  });

  // Rejection/Correction States
  const [rejectionDialogOpen, setRejectionDialogOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<any>(null);
  const [rejectionComment, setRejectionComment] = useState('');

  // Correction Dialog States
  const [correctionDialogOpen, setCorrectionDialogOpen] = useState(false);
  const [correctedContent, setCorrectedContent] = useState('');

  const activeEncounter = patientData.patient.encounters.find((e: any) => e.status === 'ACTIVE');

  // Fetch clinical notes
  const fetchClinicalNotes = async () => {
    if (!activeEncounter) return;
    
    try {
      const response = await fetch(`/api/clinical-notes?encounterId=${activeEncounter.id}`);
      const data = await response.json();
      setClinicalNotes(data.notes || []);
    } catch (error) {
      console.error('Failed to fetch clinical notes:', error);
    }
  };

  // Fetch flowsheet observations
  const fetchFlowsheetObs = async () => {
    if (!activeEncounter) return;
    
    try {
      const response = await fetch(`/api/flowsheet?encounterId=${activeEncounter.id}`);
      const data = await response.json();
      setFlowsheetObs(data.observations || []);
    } catch (error) {
      console.error('Failed to fetch flowsheet:', error);
    }
  };

  useEffect(() => {
    fetchClinicalNotes();
    fetchFlowsheetObs();
  }, [activeEncounter]);

  // Create Clinical Note
  const handleCreateNote = async (submitForCosign: boolean) => {
    if (!activeEncounter) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/clinical-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          encounterId: activeEncounter.id,
          authorId: staffId,
          cosignerId: submitForCosign ? newNote.cosignerId : null,
          noteType: newNote.noteType,
          title: newNote.title,
          content: newNote.content,
          submitForCosign,
        }),
      });

      if (response.ok) {
        setNoteDialogOpen(false);
        setNewNote({ title: '', content: '', noteType: 'NURSING_NOTE', cosignerId: '' });
        fetchClinicalNotes();
      }
    } catch (error) {
      console.error('Failed to create note:', error);
    } finally {
      setLoading(false);
    }
  };

  // Sign Note (Doctor)
  const handleSignNote = async (noteId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/clinical-notes/${noteId}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'sign',
          staffId,
        }),
      });

      if (response.ok) {
        fetchClinicalNotes();
      }
    } catch (error) {
      console.error('Failed to sign note:', error);
    } finally {
      setLoading(false);
    }
  };

  // Reject Note (Doctor)
  const handleRejectNote = async () => {
    if (!selectedNote || !rejectionComment.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/clinical-notes/${selectedNote.id}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reject',
          staffId,
          comment: rejectionComment,
        }),
      });

      if (response.ok) {
        setRejectionDialogOpen(false);
        setRejectionComment('');
        setSelectedNote(null);
        fetchClinicalNotes();
      }
    } catch (error) {
      console.error('Failed to reject note:', error);
    } finally {
      setLoading(false);
    }
  };

  // Resubmit Corrected Note (Nurse)
  const handleResubmitNote = async () => {
    if (!selectedNote || !correctedContent.trim()) {
      alert('Please provide corrected content');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/clinical-notes/${selectedNote.id}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'resubmit',
          staffId,
          content: correctedContent,
        }),
      });

      if (response.ok) {
        setCorrectionDialogOpen(false);
        setCorrectedContent('');
        setSelectedNote(null);
        fetchClinicalNotes();
      }
    } catch (error) {
      console.error('Failed to resubmit note:', error);
    } finally {
      setLoading(false);
    }
  };

  // Create Flowsheet Observation
  const handleCreateObservation = async () => {
    if (!activeEncounter) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/flowsheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          encounterId: activeEncounter.id,
          recorderId: staffId,
          observationType: newObservation.observationType,
          value: newObservation.value,
          unit: newObservation.unit,
        }),
      });

      if (response.ok) {
        setFlowsheetDialogOpen(false);
        setNewObservation({ observationType: 'HEART_RATE', value: '', unit: 'BPM' });
        fetchFlowsheetObs();
      }
    } catch (error) {
      console.error('Failed to create observation:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add Medical History
  const handleAddHistory = async () => {
    setLoading(true);
    try {
      // Mock implementation - replace with actual API call
      alert('Medical history added successfully!');
      setHistoryDialogOpen(false);
      setNewHistory({ type: 'MEDICAL_HISTORY', entry: '', icd10Code: '' });
    } catch (error) {
      console.error('Failed to add history:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return <Badge variant="secondary">Draft</Badge>;
      case 'PENDING_COSIGN':
        return <Badge className="bg-yellow-500">Pending Co-Sign</Badge>;
      case 'NEEDS_CORRECTION':
        return <Badge variant="destructive">Needs Correction</Badge>;
      case 'SIGNED':
        return <Badge className="bg-green-500">Signed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const openRejectionDialog = (note: any) => {
    setSelectedNote(note);
    setRejectionDialogOpen(true);
  };

  const openCorrectionDialog = (note: any) => {
    setSelectedNote(note);
    setCorrectedContent(note.content || '');
    setCorrectionDialogOpen(true);
  };

  return (
    <Tabs defaultValue="encounters" className="w-full">
      <TabsList className="grid grid-cols-5 w-full">
        <TabsTrigger value="encounters">
          <IconBuildingHospital className="h-4 w-4 mr-2" />
          Encounters
        </TabsTrigger>
        <TabsTrigger value="chart">
          <IconChartBar className="h-4 w-4 mr-2" />
          Chart
        </TabsTrigger>
        <TabsTrigger value="clinical-notes">
          <IconFileText className="h-4 w-4 mr-2" />
          Clinical Notes
        </TabsTrigger>
        <TabsTrigger value="history">
          <IconHistory className="h-4 w-4 mr-2" />
          Medical History
        </TabsTrigger>
        <TabsTrigger value="orders">
          <IconPill className="h-4 w-4 mr-2" />
          Orders
        </TabsTrigger>
      </TabsList>

      {/* ENCOUNTERS TAB */}
      <TabsContent value="encounters">
        <Card>
          <CardHeader>
            <CardTitle>Hospital Encounters</CardTitle>
            <CardDescription>All patient visits and admissions</CardDescription>
          </CardHeader>
          <CardContent>
            {patientData.patient.encounters.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No encounters found</p>
            ) : (
              <div className="space-y-4">
                {patientData.patient.encounters.map((encounter: any) => (
                  <Card key={encounter.id} className="bg-slate-50">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge>{encounter.type}</Badge>
                            <Badge variant="outline">{encounter.status}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Started: {formatDate(encounter.startDateTime)}
                          </p>
                          {encounter.attendingProvider && (
                            <p className="text-sm">
                              Provider: Dr. {encounter.attendingProvider.firstName} {encounter.attendingProvider.lastName}
                            </p>
                          )}
                          {encounter.currentLocation && (
                            <p className="text-sm">
                              Location: {encounter.currentLocation.unit} - Room {encounter.currentLocation.roomNumber} Bed {encounter.currentLocation.bedNumber}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      {/* CHART TAB (Flowsheet Observations) */}
      <TabsContent value="chart">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Flowsheet Observations</CardTitle>
                <CardDescription>Vital signs and patient measurements</CardDescription>
              </div>
              {role === UserRole.NURSE && activeEncounter && (
                <Dialog open={flowsheetDialogOpen} onOpenChange={setFlowsheetDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <IconPlus className="h-4 w-4 mr-2" />
                      Add Observation
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Flowsheet Observation</DialogTitle>
                      <DialogDescription>Record vital signs or measurements</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Observation Type</Label>
                        <Select
                          value={newObservation.observationType}
                          onValueChange={(value) => {
                            const unitMap: any = {
                              'HEART_RATE': 'BPM',
                              'SYSTOLIC_BP': 'MMHG',
                              'DIASTOLIC_BP': 'MMHG',
                              'TEMPERATURE': 'CELSIUS',
                              'RESPIRATORY_RATE': 'BRPM',
                              'SPO2': 'PERCENT',
                              'PAIN_SCORE': 'POINTS',
                              'WEIGHT': 'KG',
                              'HEIGHT': 'CM',
                            };
                            setNewObservation({
                              ...newObservation,
                              observationType: value,
                              unit: unitMap[value] || 'NONE',
                            });
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="HEART_RATE">Heart Rate</SelectItem>
                            <SelectItem value="SYSTOLIC_BP">Systolic BP</SelectItem>
                            <SelectItem value="DIASTOLIC_BP">Diastolic BP</SelectItem>
                            <SelectItem value="TEMPERATURE">Temperature</SelectItem>
                            <SelectItem value="RESPIRATORY_RATE">Respiratory Rate</SelectItem>
                            <SelectItem value="SPO2">SpO2</SelectItem>
                            <SelectItem value="PAIN_SCORE">Pain Score</SelectItem>
                            <SelectItem value="WEIGHT">Weight</SelectItem>
                            <SelectItem value="HEIGHT">Height</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Value</Label>
                        <Input
                          placeholder="Enter measurement value"
                          value={newObservation.value}
                          onChange={(e) => setNewObservation({ ...newObservation, value: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Unit</Label>
                        <Input
                          value={newObservation.unit}
                          disabled
                          className="bg-muted"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setFlowsheetDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreateObservation} disabled={loading}>
                        Save Observation
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {!activeEncounter ? (
              <p className="text-center text-muted-foreground py-8">No active encounter</p>
            ) : flowsheetObs.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No observations recorded</p>
            ) : (
              <div className="space-y-3">
                {flowsheetObs.map((obs: any) => (
                  <div key={obs.id} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <p className="font-semibold">{obs.observationType.replace(/_/g, ' ')}</p>
                      <p className="text-sm text-muted-foreground">
                        Recorded by: {obs.recorder.firstName} {obs.recorder.lastName} - {formatDate(obs.recordedAt)}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-lg">
                      {obs.value} {obs.unit}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      {/* CLINICAL NOTES TAB */}
      <TabsContent value="clinical-notes">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Clinical Notes</CardTitle>
                <CardDescription>Documentation requiring co-signature</CardDescription>
              </div>
              {role === UserRole.NURSE && activeEncounter && (
                <Dialog open={noteDialogOpen} onOpenChange={setNoteDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <IconPlus className="h-4 w-4 mr-2" />
                      Create Note
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Create Clinical Note</DialogTitle>
                      <DialogDescription>Document patient care and submit for co-signature</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Note Type</Label>
                        <Select
                          value={newNote.noteType}
                          onValueChange={(value) => setNewNote({ ...newNote, noteType: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="NURSING_NOTE">Nursing Note</SelectItem>
                            <SelectItem value="TRIAGE_NOTE">Triage Note</SelectItem>
                            <SelectItem value="PROGRESS_NOTE">Progress Note</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Title</Label>
                        <Input
                          placeholder="e.g., Verbal Order - Pain Medication"
                          value={newNote.title}
                          onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Content</Label>
                        <Textarea
                          placeholder="Document patient care details..."
                          value={newNote.content}
                          onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                          rows={8}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Co-Signer (Doctor/Clinician ID)</Label>
                        <Input
                          placeholder="Enter staff ID of doctor for co-signature"
                          value={newNote.cosignerId}
                          onChange={(e) => setNewNote({ ...newNote, cosignerId: e.target.value })}
                        />
                        <p className="text-xs text-muted-foreground">
                          Required if submitting for co-signature
                        </p>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => handleCreateNote(false)} disabled={loading}>
                        Save as Draft
                      </Button>
                      <Button onClick={() => handleCreateNote(true)} disabled={loading || !newNote.cosignerId}>
                        Submit for Co-Signature
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {!activeEncounter ? (
              <p className="text-center text-muted-foreground py-8">No active encounter</p>
            ) : clinicalNotes.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No clinical notes</p>
            ) : (
              <div className="space-y-4">
                {clinicalNotes.map((note: any) => (
                  <Card key={note.id} className={note.status === 'NEEDS_CORRECTION' ? 'border-red-500' : ''}>
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        {/* Header */}
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="secondary">{note.noteType.replace(/_/g, ' ')}</Badge>
                              {getStatusBadge(note.status)}
                            </div>
                            <p className="font-semibold text-lg">{note.title}</p>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-3 bg-slate-50 rounded">
                          <p className="text-sm whitespace-pre-wrap">{note.content}</p>
                        </div>

                        {/* Metadata */}
                        <div className="text-xs text-muted-foreground space-y-1">
                          <p>Author: {note.author.firstName} {note.author.lastName} ({note.author.jobTitle})</p>
                          {note.cosigner && (
                            <p>Co-Signer: Dr. {note.cosigner.firstName} {note.cosigner.lastName}</p>
                          )}
                          {note.signedAt && (
                            <p>Signed: {formatDate(note.signedAt)}</p>
                          )}
                        </div>

                        {/* Comments (Rejection Reasons) */}
                        {note.comments && note.comments.length > 0 && (
                          <div className="border-t pt-3">
                            <p className="font-semibold text-sm mb-2 flex items-center gap-2">
                              <IconAlertCircle className="h-4 w-4 text-red-500" />
                              Correction Requested:
                            </p>
                            {note.comments.map((comment: any) => (
                              <div key={comment.id} className="p-2 bg-red-50 border border-red-200 rounded mb-2">
                                <p className="text-sm text-red-900">{comment.comment}</p>
                                <p className="text-xs text-red-700 mt-1">
                                  By: Dr. {comment.createdByStaff.firstName} {comment.createdByStaff.lastName} - {formatDate(comment.createdAt)}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-2 pt-2">
                          {/* Doctor Actions */}
                          {role === UserRole.CLINICIAN && note.status === 'PENDING_COSIGN' && note.cosignerId === staffId && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleSignNote(note.id)}
                                disabled={loading}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <IconCheck className="h-4 w-4 mr-1" />
                                Sign Note
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => openRejectionDialog(note)}
                                disabled={loading}
                              >
                                <IconX className="h-4 w-4 mr-1" />
                                Request Correction
                              </Button>
                            </>
                          )}

                          {/* Nurse Actions */}
                          {role === UserRole.NURSE && note.status === 'NEEDS_CORRECTION' && note.authorId === staffId && (
                            <Button
                              size="sm"
                              onClick={() => openCorrectionDialog(note)}
                              disabled={loading}
                            >
                              <IconClock className="h-4 w-4 mr-1" />
                              Correct & Resubmit
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      {/* MEDICAL HISTORY TAB */}
      <TabsContent value="history">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Medical History</CardTitle>
                <CardDescription>Patient medical, surgical, family, and social history</CardDescription>
              </div>
              {role === UserRole.NURSE && (
                <Dialog open={historyDialogOpen} onOpenChange={setHistoryDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <IconPlus className="h-4 w-4 mr-2" />
                      Add History
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Medical History</DialogTitle>
                      <DialogDescription>Record patient medical history</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>History Type</Label>
                        <Select
                          value={newHistory.type}
                          onValueChange={(value) => setNewHistory({ ...newHistory, type: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="MEDICAL_HISTORY">Medical History</SelectItem>
                            <SelectItem value="SURGICAL_HISTORY">Surgical History</SelectItem>
                            <SelectItem value="FAMILY_HISTORY">Family History</SelectItem>
                            <SelectItem value="SOCIAL_HISTORY">Social History</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                          placeholder="Describe the medical history..."
                          value={newHistory.entry}
                          onChange={(e) => setNewHistory({ ...newHistory, entry: e.target.value })}
                          rows={4}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>ICD-10 Code (Optional)</Label>
                        <Input
                          placeholder="e.g., E11.9"
                          value={newHistory.icd10Code}
                          onChange={(e) => setNewHistory({ ...newHistory, icd10Code: e.target.value })}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setHistoryDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddHistory} disabled={loading}>
                        Add History
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {patientData.patient.patientHistories.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No medical history recorded</p>
            ) : (
              <div className="space-y-3">
                {patientData.patient.patientHistories.map((history: any) => (
                  <div key={history.id} className="flex items-start justify-between p-3 border rounded">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary">{history.type.replace(/_/g, ' ')}</Badge>
                        <Badge variant="outline">{history.status}</Badge>
                      </div>
                      <p className="font-medium">{history.entry}</p>
                      {history.icd10Code && (
                        <p className="text-sm text-muted-foreground mt-1">
                          ICD-10: {history.icd10Code}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      {/* ORDERS TAB */}
      <TabsContent value="orders">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Medications, labs, imaging, and procedures</CardDescription>
          </CardHeader>
          <CardContent>
            {patientData.recentOrders.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No recent orders</p>
            ) : (
              <div className="space-y-3">
                {patientData.recentOrders.map((order: any) => (
                  <div key={order.id} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge>{order.orderType}</Badge>
                        <Badge variant="outline">{order.status}</Badge>
                        {order.priority === 'STAT' && (
                          <Badge variant="destructive">STAT</Badge>
                        )}
                        {order.priority === 'URGENT' && (
                          <Badge className="bg-orange-500">URGENT</Badge>
                        )}
                      </div>
                      <p className="text-sm mt-1">
                        Ordered by: Dr. {order.placer.firstName} {order.placer.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      {/* REJECTION DIALOG (Doctor) */}
      <Dialog open={rejectionDialogOpen} onOpenChange={setRejectionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Correction</DialogTitle>
            <DialogDescription>
              Provide specific feedback for the nurse to correct this note
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-3 bg-slate-100 rounded">
              <p className="text-sm font-semibold mb-1">{selectedNote?.title}</p>
              <p className="text-xs text-muted-foreground whitespace-pre-wrap">{selectedNote?.content}</p>
            </div>
            <div className="space-y-2">
              <Label>Correction Required <span className="text-red-500">*</span></Label>
              <Textarea
                placeholder="Explain what needs to be corrected (required)..."
                value={rejectionComment}
                onChange={(e) => setRejectionComment(e.target.value)}
                rows={5}
                className="border-red-300 focus:border-red-500"
              />
              <p className="text-xs text-muted-foreground">
                Be specific about what needs to be corrected so the nurse can fix it accurately.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setRejectionDialogOpen(false);
              setRejectionComment('');
            }}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleRejectNote}
              disabled={loading || !rejectionComment.trim()}
            >
              <IconX className="h-4 w-4 mr-1" />
              Request Correction
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* CORRECTION DIALOG (Nurse) */}
      <Dialog open={correctionDialogOpen} onOpenChange={setCorrectionDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Correct & Resubmit Note</DialogTitle>
            <DialogDescription>
              Review the feedback and make necessary corrections
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* Show Rejection Comments */}
            {selectedNote?.comments && selectedNote.comments.length > 0 && (
              <div className="p-3 bg-red-50 border border-red-200 rounded">
                <p className="font-semibold text-sm mb-2 flex items-center gap-2 text-red-900">
                  <IconAlertCircle className="h-4 w-4" />
                  Doctor&apos;s Feedback:
                </p>
                {selectedNote.comments.map((comment: any) => (
                  <div key={comment.id} className="mb-2 last:mb-0">
                    <p className="text-sm text-red-900">{comment.comment}</p>
                    <p className="text-xs text-red-700 mt-1">
                      By: Dr. {comment.createdByStaff.firstName} {comment.createdByStaff.lastName}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Original Content */}
            <div className="space-y-2">
              <Label>Original Note Title</Label>
              <Input value={selectedNote?.title || ''} disabled className="bg-muted" />
            </div>

            {/* Editable Content */}
            <div className="space-y-2">
              <Label>Corrected Content <span className="text-red-500">*</span></Label>
              <Textarea
                placeholder="Update the note content based on doctor's feedback..."
                value={correctedContent}
                onChange={(e) => setCorrectedContent(e.target.value)}
                rows={10}
                className="border-blue-300 focus:border-blue-500"
              />
              <p className="text-xs text-muted-foreground">
                Make the necessary corrections and resubmit for co-signature.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setCorrectionDialogOpen(false);
              setCorrectedContent('');
            }}>
              Cancel
            </Button>
            <Button
              onClick={handleResubmitNote}
              disabled={loading || !correctedContent.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <IconCheck className="h-4 w-4 mr-1" />
              Resubmit for Co-Signature
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Tabs>
  );
}
                  
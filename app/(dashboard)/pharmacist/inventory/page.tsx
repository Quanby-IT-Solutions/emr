"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserRole } from "@/lib/auth/roles"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { 
  IconSearch, 
  IconPlus, 
  IconEdit, 
  IconAlertTriangle, 
  IconCalendarDue,
  IconPackage,
  IconTrendingUp,
  IconTrendingDown,
  IconBarcode,
  IconRefresh
} from "@tabler/icons-react"

interface InventoryItem {
  id: number
  name: string
  genericName: string
  strength: string
  dosageForm: string
  manufacturer: string
  batchNumber: string
  expiryDate: string
  quantity: number
  unitPrice: number
  totalValue: number
  location: string
  category: string
  status: "In Stock" | "Low Stock" | "Out of Stock" | "Expired"
  minimumStock: number
  lastRestocked: string
}

const mockInventory: InventoryItem[] = [
  {
    id: 1,
    name: "Atorvastatin",
    genericName: "Atorvastatin Calcium",
    strength: "40mg",
    dosageForm: "Tablet",
    manufacturer: "Pfizer",
    batchNumber: "ATR001234",
    expiryDate: "2025-12-31",
    quantity: 150,
    unitPrice: 2.50,
    totalValue: 375.00,
    location: "A-12-3",
    category: "Cardiovascular",
    status: "In Stock",
    minimumStock: 50,
    lastRestocked: "2024-11-20"
  },
  {
    id: 2,
    name: "Amoxicillin",
    genericName: "Amoxicillin Trihydrate",
    strength: "500mg",
    dosageForm: "Capsule",
    manufacturer: "GlaxoSmithKline",
    batchNumber: "AMX005678",
    expiryDate: "2025-06-30",
    quantity: 25,
    unitPrice: 0.75,
    totalValue: 18.75,
    location: "B-05-1",
    category: "Antibiotic",
    status: "Low Stock",
    minimumStock: 100,
    lastRestocked: "2024-11-15"
  },
  {
    id: 3,
    name: "Metformin",
    genericName: "Metformin Hydrochloride",
    strength: "500mg",
    dosageForm: "Tablet",
    manufacturer: "Teva",
    batchNumber: "MET009876",
    expiryDate: "2024-12-15",
    quantity: 0,
    unitPrice: 0.30,
    totalValue: 0,
    location: "C-08-2",
    category: "Antidiabetic",
    status: "Out of Stock",
    minimumStock: 200,
    lastRestocked: "2024-10-30"
  },
  {
    id: 4,
    name: "Ibuprofen",
    genericName: "Ibuprofen",
    strength: "400mg",
    dosageForm: "Tablet",
    manufacturer: "Johnson & Johnson",
    batchNumber: "IBU112233",
    expiryDate: "2024-11-30",
    quantity: 75,
    unitPrice: 0.15,
    totalValue: 11.25,
    location: "D-03-1",
    category: "Analgesic",
    status: "Expired",
    minimumStock: 150,
    lastRestocked: "2024-09-15"
  },
  {
    id: 5,
    name: "Lisinopril",
    genericName: "Lisinopril",
    strength: "10mg",
    dosageForm: "Tablet",
    manufacturer: "Sandoz",
    batchNumber: "LIS445566",
    expiryDate: "2026-03-31",
    quantity: 300,
    unitPrice: 0.20,
    totalValue: 60.00,
    location: "A-15-2",
    category: "Cardiovascular",
    status: "In Stock",
    minimumStock: 100,
    lastRestocked: "2024-11-22"
  }
]

export default function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [_isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [_selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)

  const filteredInventory = mockInventory.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.batchNumber.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || 
      item.status.toLowerCase().replace(" ", "-") === statusFilter
    
    const matchesCategory = categoryFilter === "all" || 
      item.category.toLowerCase() === categoryFilter
    
    return matchesSearch && matchesStatus && matchesCategory
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "In Stock":
        return <Badge variant="default" className="bg-green-500">In Stock</Badge>
      case "Low Stock":
        return <Badge variant="secondary" className="bg-yellow-500 text-white">Low Stock</Badge>
      case "Out of Stock":
        return <Badge variant="destructive">Out of Stock</Badge>
      case "Expired":
        return <Badge variant="destructive" className="bg-red-600">Expired</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getStockStats = () => {
    const total = mockInventory.length
    const inStock = mockInventory.filter(item => item.status === "In Stock").length
    const lowStock = mockInventory.filter(item => item.status === "Low Stock").length
    const outOfStock = mockInventory.filter(item => item.status === "Out of Stock").length
    const expired = mockInventory.filter(item => item.status === "Expired").length
    const totalValue = mockInventory.reduce((sum, item) => sum + item.totalValue, 0)
    
    return { total, inStock, lowStock, outOfStock, expired, totalValue }
  }

  const stats = getStockStats()

  const isExpiringSoon = (expiryDate: string) => {
    const expiry = new Date(expiryDate)
    const today = new Date()
    const threeMonths = new Date()
    threeMonths.setMonth(today.getMonth() + 3)
    return expiry <= threeMonths && expiry > today
  }

  return (
    <ProtectedRoute requiredRole={UserRole.PHARMACIST}>
      <DashboardLayout role={UserRole.PHARMACIST}>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">Pharmacy Inventory</h1>
                <p className="text-muted-foreground">
                  Manage medication stock levels and track inventory
                </p>
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <IconPlus className="h-4 w-4" />
                    Add Medication
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Medication</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Brand Name</Label>
                      <Input id="name" placeholder="Enter brand name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="generic">Generic Name</Label>
                      <Input id="generic" placeholder="Enter generic name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="strength">Strength</Label>
                      <Input id="strength" placeholder="e.g., 500mg" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="form">Dosage Form</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select form" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tablet">Tablet</SelectItem>
                          <SelectItem value="capsule">Capsule</SelectItem>
                          <SelectItem value="syrup">Syrup</SelectItem>
                          <SelectItem value="injection">Injection</SelectItem>
                          <SelectItem value="cream">Cream</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="manufacturer">Manufacturer</Label>
                      <Input id="manufacturer" placeholder="Enter manufacturer" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="batch">Batch Number</Label>
                      <Input id="batch" placeholder="Enter batch number" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input id="expiry" type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input id="quantity" type="number" placeholder="Enter quantity" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price">Unit Price</Label>
                      <Input id="price" type="number" step="0.01" placeholder="0.00" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Storage Location</Label>
                      <Input id="location" placeholder="e.g., A-12-3" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="antibiotic">Antibiotic</SelectItem>
                          <SelectItem value="analgesic">Analgesic</SelectItem>
                          <SelectItem value="cardiovascular">Cardiovascular</SelectItem>
                          <SelectItem value="antidiabetic">Antidiabetic</SelectItem>
                          <SelectItem value="respiratory">Respiratory</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="minimum">Minimum Stock Level</Label>
                      <Input id="minimum" type="number" placeholder="Enter minimum stock" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => setIsAddDialogOpen(false)}>
                      Add Medication
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="px-4 lg:px-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Items</CardTitle>
                  <IconPackage className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.total}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">In Stock</CardTitle>
                  <IconTrendingUp className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{stats.inStock}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
                  <IconAlertTriangle className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">{stats.lowStock}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
                  <IconTrendingDown className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{stats.outOfStock}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                  <IconBarcode className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${stats.totalValue.toFixed(2)}</div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Inventory Table */}
          <div className="px-4 lg:px-6">
            <Card>
              <CardHeader>
                <CardTitle>Inventory Management</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-1 relative">
                    <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search medications..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="in-stock">In Stock</SelectItem>
                      <SelectItem value="low-stock">Low Stock</SelectItem>
                      <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="antibiotic">Antibiotic</SelectItem>
                      <SelectItem value="analgesic">Analgesic</SelectItem>
                      <SelectItem value="cardiovascular">Cardiovascular</SelectItem>
                      <SelectItem value="antidiabetic">Antidiabetic</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="icon">
                    <IconRefresh className="h-4 w-4" />
                  </Button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Medication</TableHead>
                        <TableHead>Batch/Location</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Expiry Date</TableHead>
                        <TableHead>Value</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredInventory.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <div>
                              <div className="font-semibold">{item.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {item.genericName} {item.strength}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {item.dosageForm} • {item.manufacturer}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-mono text-sm">{item.batchNumber}</div>
                              <div className="text-sm text-muted-foreground">{item.location}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-semibold">{item.quantity}</div>
                              <div className="text-xs text-muted-foreground">
                                Min: {item.minimumStock}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              {getStatusBadge(item.status)}
                              {isExpiringSoon(item.expiryDate) && (
                                <Badge variant="outline" className="text-orange-600 border-orange-600">
                                  <IconCalendarDue className="h-3 w-3 mr-1" />
                                  Expiring Soon
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className={`${new Date(item.expiryDate) <= new Date() ? 'text-red-600 font-semibold' : ''}`}>
                              {new Date(item.expiryDate).toLocaleDateString()}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-semibold">${item.totalValue.toFixed(2)}</div>
                              <div className="text-xs text-muted-foreground">
                                ${item.unitPrice.toFixed(2)} each
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-1 justify-end">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => {
                                      setSelectedItem(item)
                                      setIsEditDialogOpen(true)
                                    }}
                                  >
                                    <IconEdit className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Edit Item</TooltipContent>
                              </Tooltip>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {filteredInventory.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No medications found matching your criteria
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}

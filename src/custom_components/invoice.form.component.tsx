import React, { useState } from 'react'
import { Box, Button, FormGroup, Label, Input, Table, TableHead, TableBody, TableRow, TableCell, TableCaption, Text, Link, Icon, CheckBox, Select, Radio, RadioProps, CheckboxRadioContainer } from '@adminjs/design-system'
import { ActionProps, ApiClient } from 'adminjs'
import styled from 'styled-components'

// Define UOM options
const UOM_OPTIONS = [
    { value: 'PCS', label: 'PCS' },
    { value: 'KG', label: 'KG' },
    { value: 'LBS', label: 'LBS' },
    { value: 'MTR', label: 'MTR' },
    { value: 'BOX', label: 'BOX' },
    { value: 'CTN', label: 'CTN' },
] as const
// Styled components for fixed column widths
const StyledTable = styled(Table)`
    table-layout: fixed;
    width: 100%;
    padding-top: 40px;
`

// overflow: hidden;
const StyledTableCell = styled(TableCell) <{ width?: string }>`
    width: ${({ width }) => width || 'auto'};
    text-overflow: ellipsis;
    white-space: nowrap;
`

interface Product {
    id: number;
    desc: string;
    hsCode: string;
    uom: string;
    quantity: number;
    unitPrice: number;
    total: number;
}

const InvoiceForm: React.FC<ActionProps> = (props) => {
    const { record, resource } = props
    const [invoiceData, setInvoiceData] = useState({
        invoiceNumber: '',
        date: new Date().toISOString().split('T')[0],
        amount: '',
        currency: 'USD',
        notes: '',
        type: 'standard',
    })

    const [products, setProducts] = useState<Product[]>([
        { id: 1, desc: '', hsCode: '', uom: '', quantity: 0, unitPrice: 0, total: 0 }
    ])

    const handleProductChange = (index: number, field: keyof Product, value: string | number) => {
        console.log("🚀 ~ handleProductChange ~ value:", value)
        const newProducts = [...products]
        newProducts[index][field] = value as never

        // Recalculate total for this product
        if (field === 'quantity' || field === 'unitPrice') {
            newProducts[index].total = newProducts[index].quantity * newProducts[index].unitPrice
        }

        setProducts(newProducts)

        // Update invoice total amount
        const totalAmount = newProducts.reduce((sum, product) => sum + product.total, 0)
        setInvoiceData({ ...invoiceData, amount: totalAmount.toString() })
    }

    const addProductRow = () => {
        setProducts([
            ...products,
            {
                id: products.length + 1,
                desc: '',
                hsCode: '',
                uom: '',
                quantity: 0,
                unitPrice: 0,
                total: 0
            }
        ])
    }

    const removeProductRow = (index: number) => {
        if (products.length > 1) {
            const newProducts = products.filter((_, i) => i !== index)
            setProducts(newProducts)

            // Update invoice total amount
            const totalAmount = newProducts.reduce((sum, product) => sum + product.total, 0)
            setInvoiceData({ ...invoiceData, amount: totalAmount.toString() })
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const api = new ApiClient()

        try {
            await api.recordAction({
                resourceId: resource.id,
                recordId: record.id,
                actionName: 'createInvoice',
                data: { ...invoiceData, products },
            })

            // Redirect to the record page after successful submission
            window.location.href = `/admin/resources/${resource.id}/records/${record.id}`
        } catch (error) {
            console.error('Error creating invoice:', error)
        }
    }

    return (
        <Box variant="white" padding="24px">
            <form onSubmit={handleSubmit}>
                <FormGroup>
                    <Label>Invoice Number</Label>
                    <Input
                        value={invoiceData.invoiceNumber}
                        onChange={(e) => setInvoiceData({ ...invoiceData, invoiceNumber: e.target.value })}
                        required
                    />
                </FormGroup>
                <FormGroup>
                    <Label>Invoice Type</Label>
                    <Select
                        value={{ value: invoiceData.type, label: invoiceData.type.charAt(0).toUpperCase() + invoiceData.type.slice(1) }}
                        onChange={(selectedOption) => setInvoiceData({ ...invoiceData, type: selectedOption?.value || 'standard' })}
                        options={[
                            { value: 'standard', label: 'Standard' },
                            { value: 'proforma', label: 'Proforma' },
                            { value: 'commercial', label: 'Commercial' }
                        ]}
                    />
                </FormGroup>

                <FormGroup>
                    <Label>Date</Label>
                    <Input
                        type="date"
                        value={invoiceData.date}
                        onChange={(e) => setInvoiceData({ ...invoiceData, date: e.target.value })}
                        required
                    />
                </FormGroup>

                <Box mb="xl" mt="xl" pt="xl">
                    <StyledTable>
                        <TableCaption>
                            <Text as="span">Selected Products</Text>
                            <Button onClick={addProductRow}>
                                <Icon icon="Add" />
                                Add Product
                            </Button>
                        </TableCaption>
                        <TableHead>
                            <TableRow>
                                <StyledTableCell width="25%">
                                    <Link href="/">
                                        Description
                                    </Link>
                                </StyledTableCell>
                                <StyledTableCell width="15%">
                                    HS Code
                                </StyledTableCell>
                                <StyledTableCell width="10%">
                                    UOM
                                </StyledTableCell>
                                <StyledTableCell width="10%">
                                    Quantity
                                </StyledTableCell>
                                <StyledTableCell width="15%">
                                    Unit Price
                                </StyledTableCell>
                                <StyledTableCell width="15%">
                                    Total
                                </StyledTableCell>
                                <StyledTableCell width="10%">
                                    Actions
                                </StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {products.map((product, index) => (
                                <TableRow key={product.id}>
                                    {/* <StyledTableCell width="40px">
                                        <CheckBox />
                                    </StyledTableCell> */}
                                    <StyledTableCell width="25%">
                                        <Input
                                            width="100%"
                                            value={product.desc}
                                            onChange={(e) => handleProductChange(index, 'desc', e.target.value)}
                                            required
                                        />
                                    </StyledTableCell>
                                    <StyledTableCell width="15%">
                                        <Input
                                            width="100%"
                                            value={product.hsCode}
                                            onChange={(e) => handleProductChange(index, 'hsCode', e.target.value)}
                                            required
                                        />
                                    </StyledTableCell>
                                    <StyledTableCell width="10%">
                                        <Select
                                            options={UOM_OPTIONS}
                                            value={product.uom ? { value: product.uom, label: product.uom } : null}
                                            onChange={(selectedOption) => handleProductChange(index, 'uom', selectedOption?.value || '')}
                                            isClearable={false}
                                            required
                                        />
                                    </StyledTableCell>
                                    <StyledTableCell width="10%">
                                        <Input
                                            width="100%"
                                            type="number"
                                            min="0"
                                            value={product.quantity}
                                            onChange={(e) => handleProductChange(index, 'quantity', parseFloat(e.target.value))}
                                            required
                                        />
                                    </StyledTableCell>
                                    <StyledTableCell width="10%">
                                        <Input
                                            width="100%"
                                            type="number"
                                            min="0"
                                            step="1"
                                            value={product.unitPrice}
                                            onChange={(e) => handleProductChange(index, 'unitPrice', parseFloat(e.target.value))}
                                            required
                                        />
                                    </StyledTableCell>
                                    <StyledTableCell width="10%">
                                        {product.total.toFixed(2)}
                                    </StyledTableCell>
                                    <StyledTableCell width="10%">
                                        <Button
                                            variant="danger"
                                            onClick={() => removeProductRow(index)}
                                            disabled={products.length === 1}
                                        >
                                            <Icon icon="Trash" />
                                            {/* Remove */}
                                        </Button>
                                    </StyledTableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </StyledTable>
                </Box>

                <Button variant="primary" type="submit">
                    Create Invoice
                </Button>
            </form>
        </Box>
    )
}

export default InvoiceForm

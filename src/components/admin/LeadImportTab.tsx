'use client';

import { useState, useRef } from 'react';
import {
  Upload, FileSpreadsheet, CheckCircle, XCircle, AlertTriangle,
  Loader2, Download, Users, Trash2, Eye, ChevronDown, AlertOctagon
} from 'lucide-react';

interface ParsedLead {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  businessName: string;
  businessType?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  website?: string;
  source?: string;
  // Validation
  isValid: boolean;
  errors: string[];
}

interface SkipBreakdown {
  duplicateEmailInDB: number;
  duplicateEmailInCSV: number;
  duplicatePhoneInDB: number;
  duplicatePhoneInCSV: number;
}

interface SkipDetail {
  email: string;
  businessName: string;
  reason: string;
  details?: string;
}

interface ImportResult {
  total: number;
  imported: number;
  skipped: number;
  errors: string[];
  skipBreakdown?: SkipBreakdown;
  skipDetails?: SkipDetail[];
  verificationNote?: string;
}

export default function LeadImportTab() {
  const [file, setFile] = useState<File | null>(null);
  const [parsedLeads, setParsedLeads] = useState<ParsedLead[]>([]);
  const [importing, setImporting] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [showPreview, setShowPreview] = useState(true);
  const [columnMapping, setColumnMapping] = useState<Record<string, string>>({});
  const [headers, setHeaders] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());

  // Expected columns and their possible variations
  const expectedColumns = {
    firstName: ['first_name', 'firstname', 'first', 'name', 'contact_name', 'owner_name', 'owner'],
    lastName: ['last_name', 'lastname', 'last', 'surname'],
    email: ['email', 'email_address', 'contact_email', 'business_email'],
    phone: ['phone', 'phone_number', 'telephone', 'contact_phone', 'business_phone', 'tel'],
    businessName: ['business_name', 'businessname', 'company', 'company_name', 'restaurant', 'restaurant_name', 'name'],
    businessType: ['business_type', 'type', 'category', 'cuisine', 'cuisine_type'],
    address: ['address', 'street', 'street_address', 'location'],
    city: ['city', 'town'],
    state: ['state', 'province', 'region'],
    zipCode: ['zip', 'zip_code', 'zipcode', 'postal', 'postal_code'],
    website: ['website', 'url', 'web', 'site'],
    source: ['source', 'lead_source', 'origin'],
  };

  // Auto-detect column mapping
  const autoMapColumns = (csvHeaders: string[]) => {
    const mapping: Record<string, string> = {};

    for (const [field, variations] of Object.entries(expectedColumns)) {
      const normalizedHeaders = csvHeaders.map(h => h.toLowerCase().trim().replace(/[^a-z0-9]/g, '_'));

      for (const variation of variations) {
        const index = normalizedHeaders.findIndex(h => h.includes(variation) || variation.includes(h));
        if (index !== -1 && !Object.values(mapping).includes(csvHeaders[index])) {
          mapping[field] = csvHeaders[index];
          break;
        }
      }
    }

    return mapping;
  };

  // Parse CSV file
  const parseCSV = (text: string): { headers: string[]; rows: string[][] } => {
    const lines = text.split(/\r?\n/).filter(line => line.trim());
    if (lines.length === 0) return { headers: [], rows: [] };

    // Parse CSV properly handling quoted fields
    const parseLine = (line: string): string[] => {
      const result: string[] = [];
      let current = '';
      let inQuotes = false;

      for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          result.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      result.push(current.trim());
      return result;
    };

    const headers = parseLine(lines[0]);
    const rows = lines.slice(1).map(parseLine);

    return { headers, rows };
  };

  // Validate a lead - DISABLED: Import ALL leads regardless of missing fields
  const validateLead = (lead: Partial<ParsedLead>): { isValid: boolean; errors: string[] } => {
    // NO VALIDATION - accept ALL leads
    return { isValid: true, errors: [] };
  };

  const isValidEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Handle file selection
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setParsing(true);
    setImportResult(null);
    setParsedLeads([]);
    setSelectedIndices(new Set());

    try {
      const text = await selectedFile.text();
      const { headers: csvHeaders, rows } = parseCSV(text);

      setHeaders(csvHeaders);
      const mapping = autoMapColumns(csvHeaders);
      setColumnMapping(mapping);

      // Parse leads with the mapping
      const leads = rows.map(row => {
        const getValue = (field: string) => {
          const column = mapping[field];
          if (!column) return '';
          const index = csvHeaders.indexOf(column);
          return index >= 0 ? row[index]?.trim() || '' : '';
        };

        // Get name fields
        const firstName = getValue('firstName');
        const lastName = getValue('lastName');
        const lead: Partial<ParsedLead> = {
          firstName,
          lastName,
          email: getValue('email'),
          phone: getValue('phone'),
          businessName: getValue('businessName'),
          businessType: getValue('businessType'),
          address: getValue('address'),
          city: getValue('city'),
          state: getValue('state'),
          zipCode: getValue('zipCode'),
          website: getValue('website'),
          source: getValue('source') || 'CSV Import',
        };

        const validation = validateLead(lead);
        return {
          ...lead,
          firstName: lead.firstName || '',
          lastName: lead.lastName || '',
          email: lead.email || '',
          phone: lead.phone || '',
          businessName: lead.businessName || '',
          isValid: validation.isValid,
          errors: validation.errors,
        } as ParsedLead;
      });

      setParsedLeads(leads);
    } catch (error) {
      console.error('Error parsing file:', error);
      alert('Error parsing file. Please check the format.');
    } finally {
      setParsing(false);
    }
  };

  // Import leads to database
  const [importProgress, setImportProgress] = useState<{ current: number; total: number } | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteResult, setDeleteResult] = useState<{ deleted: number } | null>(null);

  // Delete all leads
  const handleDeleteAllLeads = async () => {
    setDeleting(true);
    try {
      const response = await fetch('/api/leads/delete-all', {
        method: 'DELETE',
        headers: {
          'x-confirm-delete': 'DELETE_ALL_LEADS',
        },
      });

      const result = await response.json();

      if (result.success) {
        setDeleteResult({ deleted: result.deleted });
        setShowDeleteConfirm(false);
        // Clear import result since leads are gone
        setImportResult(null);
      } else {
        alert('Failed to delete leads: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete leads. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  // Import leads - now uses Supabase bulk insert (FAST!)
  const handleImport = async () => {
    const validLeads = parsedLeads;

    console.log(`📤 Importing ${validLeads.length} leads via Supabase bulk insert`);

    if (validLeads.length === 0) {
      alert('No leads to import');
      return;
    }

    setImporting(true);
    setImportResult(null);
    setImportProgress({ current: 0, total: validLeads.length });

    try {
      // Single bulk insert - no batching needed with Supabase!
      const response = await fetch('/api/leads/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leads: validLeads }),
      });

      const result = await response.json();

      setImportProgress(null);

      if (result.success) {
        setImportResult({
          total: validLeads.length,
          imported: result.imported || 0,
          skipped: result.skipped || 0,
          errors: result.errors || [],
        });

        // Clear the form after successful import
        if (result.imported > 0) {
          setFile(null);
          setParsedLeads([]);
          setSelectedIndices(new Set());
          setHeaders([]);
          setColumnMapping({});
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }
      } else {
        setImportResult({
          total: validLeads.length,
          imported: 0,
          skipped: 0,
          errors: [result.error || 'Import failed'],
        });
      }
    } catch (error: any) {
      console.error('Import error:', error);
      setImportProgress(null);
      setImportResult({
        total: validLeads.length,
        imported: 0,
        skipped: 0,
        errors: [error.message || 'Import failed. Please try again.'],
      });
    } finally {
      setImporting(false);
    }
  };

  // Download sample CSV
  const downloadSampleCSV = () => {
    const sampleData = `business_name,first_name,last_name,email,phone,business_type,address,city,state,zip_code,website
"Joe's Pizza","Joe","Smith","joe@joespizza.com","(555) 123-4567","Pizza","123 Main St","Boston","MA","02101","www.joespizza.com"
"Maria's Mexican","Maria","Garcia","maria@mariasmexican.com","555-987-6543","Mexican","456 Oak Ave","Cambridge","MA","02139",""
"The Burger Joint","","","info@burgerjoint.com","5551234567","American","789 Elm St","Somerville","MA","02143","burgerjoint.com"`;

    const blob = new Blob([sampleData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_leads.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Selection helpers
  const toggleSelectAll = () => {
    if (selectedIndices.size === parsedLeads.length) {
      // Deselect all
      setSelectedIndices(new Set());
    } else {
      // Select all
      setSelectedIndices(new Set(parsedLeads.map((_, i) => i)));
    }
  };

  const toggleSelectRow = (index: number) => {
    const newSelected = new Set(selectedIndices);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedIndices(newSelected);
  };

  const selectInvalid = () => {
    const invalidIndices = parsedLeads
      .map((lead, i) => (!lead.isValid ? i : -1))
      .filter(i => i !== -1);
    setSelectedIndices(new Set(invalidIndices));
  };

  const deleteSelected = () => {
    if (selectedIndices.size === 0) return;
    setParsedLeads(prev => prev.filter((_, i) => !selectedIndices.has(i)));
    setSelectedIndices(new Set());
  };

  const isAllSelected = parsedLeads.length > 0 && selectedIndices.size === parsedLeads.length;
  const isSomeSelected = selectedIndices.size > 0 && selectedIndices.size < parsedLeads.length;

  const validCount = parsedLeads.filter(l => l.isValid).length;
  const invalidCount = parsedLeads.filter(l => !l.isValid).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Import Leads</h2>
          <p className="text-gray-500 mt-1">Upload CSV files from your Toast scraper or other sources</p>
        </div>
        <button
          onClick={downloadSampleCSV}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition text-sm"
        >
          <Download className="w-4 h-4" />
          Download Sample CSV
        </button>
      </div>

      {/* Import Result */}
      {importResult && (
        <div className={`p-4 rounded-xl border ${
          importResult.imported > 0 ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'
        }`}>
          <div className="flex items-center gap-3 mb-3">
            {importResult.imported > 0 ? (
              <CheckCircle className="w-6 h-6 text-green-600" />
            ) : (
              <AlertTriangle className="w-6 h-6 text-amber-600" />
            )}
            <div>
              <p className="font-semibold text-gray-900">
                Import Complete: {importResult.imported} of {importResult.total} leads imported
              </p>
              {importResult.skipped > 0 && (
                <p className="text-sm text-gray-600">
                  {importResult.skipped} skipped
                </p>
              )}
            </div>
          </div>

          {/* Detailed Skip Breakdown */}
          {importResult.skipBreakdown && importResult.skipped > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-sm font-semibold text-gray-700 mb-2">Skip Breakdown:</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {importResult.skipBreakdown.duplicateEmailInCSV > 0 && (
                  <div className="flex items-center gap-2 text-orange-700 bg-orange-50 px-2 py-1 rounded">
                    <span className="font-medium">{importResult.skipBreakdown.duplicateEmailInCSV}</span>
                    <span>duplicate emails in CSV</span>
                  </div>
                )}
                {importResult.skipBreakdown.duplicateEmailInDB > 0 && (
                  <div className="flex items-center gap-2 text-blue-700 bg-blue-50 px-2 py-1 rounded">
                    <span className="font-medium">{importResult.skipBreakdown.duplicateEmailInDB}</span>
                    <span>already in database</span>
                  </div>
                )}
                {importResult.skipBreakdown.duplicatePhoneInCSV > 0 && (
                  <div className="flex items-center gap-2 text-purple-700 bg-purple-50 px-2 py-1 rounded">
                    <span className="font-medium">{importResult.skipBreakdown.duplicatePhoneInCSV}</span>
                    <span>duplicate phones in CSV</span>
                  </div>
                )}
                {importResult.skipBreakdown.duplicatePhoneInDB > 0 && (
                  <div className="flex items-center gap-2 text-gray-700 bg-gray-100 px-2 py-1 rounded">
                    <span className="font-medium">{importResult.skipBreakdown.duplicatePhoneInDB}</span>
                    <span>phones already in database</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Verification Warning */}
          {importResult.verificationNote && (
            <div className="mt-3 pt-3 border-t border-amber-300">
              <div className="flex items-center gap-2 text-amber-800 bg-amber-100 px-3 py-2 rounded">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">{importResult.verificationNote}</span>
              </div>
            </div>
          )}

          {/* Import Errors */}
          {importResult.errors && importResult.errors.length > 0 && (
            <div className="mt-3 pt-3 border-t border-red-200">
              <p className="text-sm font-semibold text-red-700 mb-2 flex items-center gap-2">
                <XCircle className="w-4 h-4" />
                Errors ({importResult.errors.length}):
              </p>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {importResult.errors.slice(0, 10).map((error, i) => (
                  <div key={i} className="text-xs bg-red-50 text-red-700 px-2 py-1 rounded">
                    {error}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* First few skip details */}
          {importResult.skipDetails && importResult.skipDetails.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-sm font-semibold text-gray-700 mb-2">
                Skipped Leads (showing first {Math.min(importResult.skipDetails.length, 10)}):
              </p>
              <div className="max-h-40 overflow-y-auto space-y-1">
                {importResult.skipDetails.slice(0, 10).map((skip, i) => (
                  <div key={i} className="text-xs bg-gray-50 px-2 py-1 rounded flex justify-between">
                    <span className="font-medium truncate max-w-[200px]">{skip.businessName || 'Unknown'}</span>
                    <span className="text-gray-500 truncate max-w-[200px]">{skip.email}</span>
                    <span className={`px-1.5 py-0.5 rounded text-xs ${
                      skip.reason === 'duplicate_email_csv' ? 'bg-orange-100 text-orange-700' :
                      skip.reason === 'duplicate_email_db' ? 'bg-blue-100 text-blue-700' :
                      skip.reason === 'duplicate_phone_csv' ? 'bg-purple-100 text-purple-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {skip.reason === 'duplicate_email_csv' ? 'Dup email (CSV)' :
                       skip.reason === 'duplicate_email_db' ? 'Exists in DB' :
                       skip.reason === 'duplicate_phone_csv' ? 'Dup phone (CSV)' :
                       skip.reason === 'duplicate_phone_db' ? 'Phone in DB' :
                       'Error'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Upload Area */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition ${
            file ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-[#FF6B35] hover:bg-orange-50'
          }`}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const droppedFile = e.dataTransfer.files[0];
            if (droppedFile && (droppedFile.name.endsWith('.csv') || droppedFile.name.endsWith('.txt'))) {
              const input = fileInputRef.current;
              if (input) {
                const dt = new DataTransfer();
                dt.items.add(droppedFile);
                input.files = dt.files;
                handleFileSelect({ target: input } as any);
              }
            }
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.txt"
            onChange={handleFileSelect}
            className="hidden"
            id="csv-upload"
          />

          {parsing ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-12 h-12 text-[#FF6B35] animate-spin" />
              <p className="text-gray-600">Parsing file...</p>
            </div>
          ) : file ? (
            <div className="flex flex-col items-center gap-3">
              <FileSpreadsheet className="w-12 h-12 text-green-600" />
              <div>
                <p className="font-semibold text-gray-900">{file.name}</p>
                <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
              <button
                onClick={() => {
                  setFile(null);
                  setParsedLeads([]);
                  setSelectedIndices(new Set());
                  setHeaders([]);
                  setColumnMapping({});
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                className="flex items-center gap-1 text-red-600 hover:text-red-700 text-sm"
              >
                <Trash2 className="w-4 h-4" />
                Remove
              </button>
            </div>
          ) : (
            <label htmlFor="csv-upload" className="cursor-pointer">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-900 font-semibold mb-1">Drop your CSV file here or click to upload</p>
              <p className="text-sm text-gray-500">Supports .csv and .txt files</p>
            </label>
          )}
        </div>
      </div>

      {/* Column Mapping */}
      {headers.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Column Mapping</h3>
          <p className="text-sm text-gray-500 mb-4">
            We auto-detected your columns. Adjust if needed:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.entries(expectedColumns).map(([field, _]) => (
              <div key={field}>
                <label className="block text-xs font-medium text-gray-500 mb-1 capitalize">
                  {field.replace(/([A-Z])/g, ' $1').trim()}
                </label>
                <select
                  value={columnMapping[field] || ''}
                  onChange={(e) => setColumnMapping(prev => ({ ...prev, [field]: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                >
                  <option value="">-- Not mapped --</option>
                  {headers.map(h => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
          <button
            onClick={() => {
              // Re-parse with updated mapping
              if (file) {
                file.text().then(text => {
                  const { headers: csvHeaders, rows } = parseCSV(text);
                  const leads = rows.map(row => {
                    const getValue = (field: string) => {
                      const column = columnMapping[field];
                      if (!column) return '';
                      const index = csvHeaders.indexOf(column);
                      return index >= 0 ? row[index]?.trim() || '' : '';
                    };

                    const lead: Partial<ParsedLead> = {
                      firstName: getValue('firstName'),
                      lastName: getValue('lastName'),
                      email: getValue('email'),
                      phone: getValue('phone'),
                      businessName: getValue('businessName'),
                      businessType: getValue('businessType'),
                      address: getValue('address'),
                      city: getValue('city'),
                      state: getValue('state'),
                      zipCode: getValue('zipCode'),
                      website: getValue('website'),
                      source: getValue('source') || 'CSV Import',
                    };

                    const validation = validateLead(lead);
                    return {
                      ...lead,
                      firstName: lead.firstName || '',
                      lastName: lead.lastName || '',
                      email: lead.email || '',
                      phone: lead.phone || '',
                      businessName: lead.businessName || '',
                      isValid: validation.isValid,
                      errors: validation.errors,
                    } as ParsedLead;
                  });
                  setParsedLeads(leads);
                });
              }
            }}
            className="mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition"
          >
            Re-parse with Updated Mapping
          </button>
        </div>
      )}

      {/* Preview */}
      {parsedLeads.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          {/* Preview Header */}
          <div className="p-4 border-b bg-gray-50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-4">
                <h3 className="text-lg font-bold text-gray-900">Preview</h3>
                <div className="flex items-center gap-3 text-sm">
                  <span className="flex items-center gap-1 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    {validCount} valid
                  </span>
                  {invalidCount > 0 && (
                    <span className="flex items-center gap-1 text-red-600">
                      <XCircle className="w-4 h-4" />
                      {invalidCount} invalid
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
              >
                <Eye className="w-4 h-4" />
                {showPreview ? 'Hide' : 'Show'} Preview
                <ChevronDown className={`w-4 h-4 transition ${showPreview ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Selection Controls */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-gray-600">
                {selectedIndices.size > 0 ? (
                  <span className="font-medium text-[#FF6B35]">{selectedIndices.size} selected</span>
                ) : (
                  'Select rows to remove'
                )}
              </span>
              <div className="flex items-center gap-2 ml-auto">
                {invalidCount > 0 && (
                  <button
                    onClick={selectInvalid}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    Select Invalid ({invalidCount})
                  </button>
                )}
                {selectedIndices.size > 0 && (
                  <>
                    <button
                      onClick={() => setSelectedIndices(new Set())}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                    >
                      Clear Selection
                    </button>
                    <button
                      onClick={deleteSelected}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete Selected ({selectedIndices.size})
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Preview Table */}
          {showPreview && (
            <div className="max-h-[400px] overflow-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-3 py-2 text-center w-10">
                      <input
                        type="checkbox"
                        checked={isAllSelected}
                        ref={(el) => {
                          if (el) el.indeterminate = isSomeSelected;
                        }}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 rounded border-gray-300 text-[#FF6B35] focus:ring-[#FF6B35] cursor-pointer"
                        title={isAllSelected ? "Deselect all" : "Select all"}
                      />
                    </th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-500">Status</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-500">Business</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-500">Contact</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-500">Email</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-500">Phone</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-500">Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {parsedLeads.slice(0, 100).map((lead, index) => (
                    <tr
                      key={index}
                      className={`${lead.isValid ? '' : 'bg-red-50'} ${selectedIndices.has(index) ? 'bg-orange-50' : ''}`}
                    >
                      <td className="px-3 py-2 text-center">
                        <input
                          type="checkbox"
                          checked={selectedIndices.has(index)}
                          onChange={() => toggleSelectRow(index)}
                          className="w-4 h-4 rounded border-gray-300 text-[#FF6B35] focus:ring-[#FF6B35] cursor-pointer"
                        />
                      </td>
                      <td className="px-3 py-2">
                        {lead.isValid ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <div className="group relative">
                            <XCircle className="w-5 h-5 text-red-500" />
                            <div className="absolute left-0 top-6 hidden group-hover:block bg-gray-900 text-white text-xs p-2 rounded shadow-lg z-10 w-48">
                              {lead.errors.join(', ')}
                            </div>
                          </div>
                        )}
                      </td>
                      <td className="px-3 py-2 font-medium">{lead.businessName || '-'}</td>
                      <td className="px-3 py-2">{[lead.firstName, lead.lastName].filter(Boolean).join(' ') || '-'}</td>
                      <td className="px-3 py-2">{lead.email || '-'}</td>
                      <td className="px-3 py-2">{lead.phone || '-'}</td>
                      <td className="px-3 py-2">{lead.businessType || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {parsedLeads.length > 100 && (
                <div className="p-3 bg-gray-50 text-center text-sm text-gray-500">
                  Showing first 100 of {parsedLeads.length} leads
                </div>
              )}
            </div>
          )}

          {/* Import Button */}
          <div className="p-4 border-t bg-gray-50 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {validCount} leads ready to import
            </p>
            <div className="flex items-center gap-4">
              {importProgress && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#FF6B35] transition-all duration-300"
                      style={{ width: `${Math.round((importProgress.current / importProgress.total) * 100)}%` }}
                    />
                  </div>
                  <span>{importProgress.current}/{importProgress.total}</span>
                </div>
              )}
              <button
                onClick={handleImport}
                disabled={importing || validCount === 0}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition ${
                  importing || validCount === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-[#FF6B35] text-white hover:bg-[#e55a2b]'
                }`}
              >
                {importing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {importProgress ? `Importing batch...` : 'Importing...'}
                  </>
                ) : (
                  <>
                    <Users className="w-5 h-5" />
                    Import {validCount} Leads
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h3 className="font-semibold text-blue-900 mb-2">CSV Format Tips</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Required: <strong>business_name</strong> AND <strong>email</strong></li>
          <li>• Optional: first_name, last_name, phone, business_type, address, city, state, zip_code, website</li>
          <li>• Phone numbers can be in any format (we'll clean them up)</li>
          <li>• Duplicate leads (same email) will be skipped</li>
          <li>• Click the trash icon to remove individual leads before importing</li>
          <li>• Imported leads will appear in the Leads tab with "CSV Import" as source</li>
        </ul>
      </div>

      {/* Delete Result */}
      {deleteResult && (
        <div className="p-4 rounded-xl border bg-green-50 border-green-200">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <p className="font-semibold text-gray-900">
              Successfully deleted {deleteResult.deleted} leads. You can now import fresh data.
            </p>
          </div>
        </div>
      )}

      {/* Danger Zone - Delete All Leads */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-red-900 flex items-center gap-2">
              <AlertOctagon className="w-5 h-5" />
              Danger Zone
            </h3>
            <p className="text-sm text-red-700 mt-1">
              Delete all existing leads to start fresh. This cannot be undone.
            </p>
          </div>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition text-sm font-semibold"
          >
            <Trash2 className="w-4 h-4" />
            Delete All Leads
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertOctagon className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Delete All Leads?</h3>
            </div>

            <p className="text-gray-600 mb-6">
              This will permanently delete <strong>all leads</strong> from the database.
              This action cannot be undone. Are you absolutely sure?
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
                className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAllLeads}
                disabled={deleting}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition"
              >
                {deleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Yes, Delete All
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

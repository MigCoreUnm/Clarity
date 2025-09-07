// src/pages/PoliciesPage.tsx

import React, { useState, useEffect } from 'react';
import { AllPoliciesView } from '../components/AllPoliciesView/AllPoliciesView';
import { PolicyDetailPage } from '../components/AllPoliciesView/PolicyDetailPage';
import type { Policy, PolicyGroup as PolicyGroupType } from '../types2';
import { api, WebSocketClient } from '../services/api';

// Mock data to start with
const initialData: PolicyGroupType[] = [
  {
    id: 'group-1',
    title: 'Travel & Expense Policy',
    policies: [
      {
        id: 'policy-1a',
        title: 'Air Travel Guidelines',
        description: '• Economy class for flights under 6 hours\n• Premium economy allowed for flights 6-10 hours\n• Business class permitted for flights over 10 hours or red-eye flights over 4 hours\n• First class requires C-Suite approval\n• Book flights at least 14 days in advance when possible\n• Use preferred airline partners for corporate discounts',
        hiddenNotes: 'VP level and above automatically approved for business class on all international flights. C-Suite exempt from advance booking requirements.',
      },
      {
        id: 'policy-1b',
        title: 'Hotel & Accommodation',
        description: '• Maximum nightly rate: $250 (Tier 1 cities: NYC, SF, London, Tokyo)\n• Maximum nightly rate: $175 (Tier 2 cities)\n• Maximum nightly rate: $125 (All other locations)\n• Book through corporate travel portal for negotiated rates\n• Incidentals covered up to $25/day\n• Extended stays over 30 days require special approval',
        hiddenNotes: 'Directors and above have 50% higher limits. Executive team has no preset limits but must be reasonable.',
      },
      {
        id: 'policy-1c',
        title: 'Meals & Entertainment',
        description: '• Breakfast: $25 per person\n• Lunch: $35 per person\n• Dinner: $65 per person\n• Client entertainment: $150 per person (requires pre-approval for amounts over $500 total)\n• Team events: $75 per person\n• Alcohol permitted but must not exceed 30% of total bill\n• Tips maximum 20% (25% for exceptional service)',
        hiddenNotes: 'Sales team has 2x limits for client entertainment. No alcohol restrictions for C-Suite client dinners.',
      },
      {
        id: 'policy-1d',
        title: 'Ground Transportation',
        description: '• Use public transit or shuttle services when available\n• Standard taxi/rideshare for trips under 25 miles\n• Rental cars: Mid-size or below (SUV/luxury requires justification)\n• Airport parking: Long-term economy lots preferred\n• Personal vehicle mileage: $0.65 per mile\n• No limo services without VP approval',
        hiddenNotes: 'C-Suite and Board members may use executive car service. International visitors at Director+ level eligible for car service.',
      },
      {
        id: 'policy-1e',
        title: 'Expense Submission & Reimbursement',
        description: '• Submit expenses within 30 days of travel completion\n• Receipts required for all expenses over $25\n• Corporate card mandatory for all business expenses over $100\n• Personal expenses must be separated and marked clearly\n• Foreign currency converted at date of expense\n• Reimbursement processed within 10 business days of approval',
        hiddenNotes: 'Executive assistants may submit on behalf of C-Suite. Board member expenses reviewed by CFO only.',
      },
    ],
  },
  {
    id: 'group-2',
    title: 'Procurement & Vendor Management Policy',
    policies: [
      {
        id: 'policy-2a',
        title: 'Purchase Approval Thresholds',
        description: '• Under $1,000: Manager approval\n• $1,000 - $10,000: Director approval\n• $10,000 - $50,000: VP approval + Finance review\n• $50,000 - $250,000: C-Suite approval + CFO sign-off\n• Over $250,000: CEO approval + Board notification\n• All software purchases require IT security review\n• All contracts require Legal review',
        hiddenNotes: 'Emergency purchases may bypass one level with retroactive approval. CEO may approve up to $1M without Board.',
      },
      {
        id: 'policy-2b',
        title: 'Vendor Selection Requirements',
        description: '• 3 competitive bids required for purchases over $25,000\n• Vendor must pass security assessment for data access\n• Preferred vendor list must be checked first\n• New vendors require W-9 and insurance certificates\n• International vendors need additional compliance review\n• Annual vendor performance reviews required\n• Conflict of interest disclosure mandatory',
        hiddenNotes: 'Sole source justification accepted for specialized services. Existing vendor relationships may waive bid requirements with VP approval.',
      },
      {
        id: 'policy-2c',
        title: 'Contract Terms & Negotiation',
        description: '• Standard terms required for all agreements\n• Auto-renewal clauses must be flagged and tracked\n• Payment terms: Net 30 standard (Net 45 for amounts over $100k)\n• Early payment discounts should be negotiated (2/10 net 30)\n• Liability caps and indemnification required\n• Data protection and confidentiality clauses mandatory\n• Termination requires 30-day notice minimum',
        hiddenNotes: 'Strategic partnerships may have custom terms with CEO approval. Fortune 500 vendors may use their paper with Legal review.',
      },
      {
        id: 'policy-2d',
        title: 'Purchasing Card (P-Card) Usage',
        description: '• Monthly limit: $5,000 per card\n• Single transaction limit: $2,500\n• Prohibited: Cash advances, personal purchases, gift cards\n• Monthly reconciliation required by 5th business day\n• Lost card must be reported within 24 hours\n• Sharing card information is grounds for termination\n• All purchases must have valid business purpose',
        hiddenNotes: 'Department heads may request temporary limit increases. IT equipment purchases may exceed limits with pre-approval.',
      },
    ],
  },
  {
    id: 'group-3',
    title: 'IT & Technology Policy',
    policies: [
      {
        id: 'policy-3a',
        title: 'Software & Subscriptions',
        description: '• All software must be approved by IT Security before purchase\n• SaaS subscriptions require annual review for usage\n• Open source software needs security scan and Legal review\n• Personal software prohibited on company devices\n• Cloud storage must be corporate-approved platforms only\n• API integrations require architecture review\n• License compliance audited quarterly',
        hiddenNotes: 'Development team may use unapproved tools in sandboxed environments. C-Suite may have personal productivity apps with IT knowledge.',
      },
      {
        id: 'policy-3b',
        title: 'Hardware & Equipment',
        description: '• Laptop refresh cycle: 3 years (2 years for Engineering)\n• Standard configurations must be used (customization needs justification)\n• External monitors: 2 maximum per employee\n• Peripherals budget: $500 per employee per year\n• Home office equipment: $1,500 one-time allowance\n• Lost/damaged equipment reported within 48 hours\n• Personal devices require MDM enrollment for email access',
        hiddenNotes: 'Engineers and designers may request high-spec machines. Executives get latest models regardless of refresh cycle.',
      },
      {
        id: 'policy-3c',
        title: 'Security & Access Control',
        description: '• Multi-factor authentication mandatory for all systems\n• Password minimum: 12 characters with complexity requirements\n• VPN required for remote access to internal resources\n• Annual security training completion mandatory\n• Phishing test failures require immediate retraining\n• USB ports disabled by default (exceptions case-by-case)\n• Clean desk policy enforced for sensitive information',
        hiddenNotes: 'C-Suite may have password managers with IT support. Board members exempt from training but get quarterly briefings.',
      },
      {
        id: 'policy-3d',
        title: 'Data Management & Privacy',
        description: '• Customer data stays in approved systems only\n• No sensitive data in email or chat applications\n• Personal identifiable information (PII) must be encrypted\n• Data retention follows legal requirements by jurisdiction\n• Right to deletion requests processed within 30 days\n• Cross-border data transfer requires Legal approval\n• Regular backups with quarterly restore testing',
        hiddenNotes: 'Legal and HR have extended retention for litigation holds. Executive communications may have shorter retention for liability.',
      },
    ],
  },
  {
    id: 'group-4',
    title: 'Human Resources Policy',
    policies: [
      {
        id: 'policy-4a',
        title: 'Recruitment & Hiring',
        description: '• All positions require approved job requisition\n• Internal candidates get 5-day priority consideration\n• Referral bonus: $2,500 (technical roles: $5,000)\n• Background checks mandatory for all hires\n• Reference checks minimum 2 required\n• Offer letters require HR and hiring manager approval\n• Signing bonus requires VP approval\n• Relocation assistance capped at $10,000',
        hiddenNotes: 'Executive hires may bypass internal posting. C-Suite packages negotiated directly with CEO/Board. Referral bonus doubles for Director+ roles.',
      },
      {
        id: 'policy-4b',
        title: 'Compensation & Benefits',
        description: '• Annual merit increase budget: 3% of payroll\n• Promotion increases: 8-15% typical range\n• Equity grants follow vesting schedule (4 years, 1-year cliff)\n• Health insurance: Company pays 80% employee, 50% dependents\n• 401k match: 4% with immediate vesting\n• PTO: 15 days year 1-2, 20 days year 3+, unlimited at year 5+\n• Parental leave: 12 weeks paid primary, 6 weeks secondary',
        hiddenNotes: 'Retention increases may exceed guidelines with CEO approval. C-Suite has supplemental insurance and executive physicals.',
      },
      {
        id: 'policy-4c',
        title: 'Performance Management',
        description: '• Annual reviews conducted in Q1 for prior year\n• Mid-year check-ins mandatory for all employees\n• Performance improvement plans (PIP): 30-60-90 day structure\n• Calibration sessions for ratings consistency\n• 360 feedback for people managers and above\n• Goal setting follows OKR methodology\n• Underperformance addressed within 30 days of identification',
        hiddenNotes: 'C-Suite reviews conducted by Board Compensation Committee. PIPs for Directors+ require CHRO involvement.',
      },
      {
        id: 'policy-4d',
        title: 'Professional Development',
        description: '• Annual L&D budget: $2,000 per employee\n• Conference attendance: 2 per year with manager approval\n• Certification reimbursement upon successful completion\n• Internal mentorship program participation encouraged\n• LinkedIn Learning licenses for all employees\n• Tuition reimbursement: $5,250 per year (grade B or better)\n• Leadership coaching for Directors and above',
        hiddenNotes: 'High-potential employees may exceed budget with sponsor approval. Executive coaching budgets separate and confidential.',
      },
    ],
  },
  {
    id: 'group-5',
    title: 'Financial Controls Policy',
    policies: [
      {
        id: 'policy-5a',
        title: 'Budget Management',
        description: '• Quarterly budget reviews with Finance required\n• Variance over 10% requires written explanation\n• Headcount changes need CFO approval\n• Capital expenditures follow separate approval process\n• Budget transfers between departments need both managers approval\n• Unbudgeted expenses over $5,000 need special approval\n• Year-end spending freeze starts November 15',
        hiddenNotes: 'Revenue-generating departments have 20% variance allowance. CEO discretionary budget not subject to freeze.',
      },
      {
        id: 'policy-5b',
        title: 'Invoice & Payment Processing',
        description: '• Invoices submitted within 5 days of receipt\n• Three-way match required (PO, receipt, invoice)\n• Rush payments require VP approval and justification\n• ACH/wire transfers require dual approval\n• International payments need additional compliance check\n• Vendor setup requires tax documentation\n• Payment disputes escalated within 48 hours',
        hiddenNotes: 'Recurring payments under $10K may be auto-approved. Legal settlements processed outside standard flow.',
      },
      {
        id: 'policy-5c',
        title: 'Internal Audit & Compliance',
        description: '• Quarterly internal audits of high-risk areas\n• Annual external audit preparation starts Q3\n• SOX compliance testing for public company readiness\n• Expense report audits: 20% random sampling\n• Segregation of duties enforced in financial systems\n• Monthly account reconciliations required by day 5\n• Material weaknesses reported to Audit Committee immediately',
        hiddenNotes: 'Executive expenses reviewed by internal audit only. Board expenses reviewed by external audit.',
      },
      {
        id: 'policy-5d',
        title: 'Revenue Recognition & Billing',
        description: '• Revenue recognized per ASC 606 guidelines\n• Customer contracts require Legal and Finance review\n• Billing occurs on delivery/milestone completion\n• Credit terms: Net 30 standard (Net 60 for enterprise)\n• Discounts over 20% require VP Sales approval\n• Write-offs over $10,000 need CFO approval\n• Collections escalation at 30-60-90 days',
        hiddenNotes: 'Strategic accounts may have custom payment terms. Board relationships handled by CEO/CFO directly.',
      },
    ],
  },
  {
    id: 'group-6',
    title: 'Marketing & Events Policy',
    policies: [
      {
        id: 'policy-6a',
        title: 'Marketing Campaigns & Advertising',
        description: '• Campaign budgets over $50,000 need CMO approval\n• Agency selection requires 3 proposals for projects over $100,000\n• Brand guidelines must be followed for all materials\n• Legal review required for claims and testimonials\n• Social media posts follow approval workflow\n• Influencer partnerships need FTC disclosure compliance\n• ROI tracking required for campaigns over $25,000',
        hiddenNotes: 'Crisis communications bypass normal approval. CEO may approve expedited campaigns for strategic initiatives.',
      },
      {
        id: 'policy-6b',
        title: 'Events & Conferences',
        description: '• Event budgets approved based on size: <50 people: $10,000, 50-200: $50,000, 200+: CMO approval\n• Venue selection requires 3 bids for events over $25,000\n• Catering: $75 per person for full day, $40 for half day\n• Speaker fees capped at $10,000 without special approval\n• Sponsorship benefits must be documented and tracked\n• Post-event survey required for events over $10,000\n• Alcohol service requires additional insurance',
        hiddenNotes: 'Executive events and Board meetings have separate budgets. Customer advisory boards have premium allowances.',
      },
      {
        id: 'policy-6c',
        title: 'Promotional Items & Swag',
        description: '• Promotional items budget: $50 per employee per quarter\n• Customer gifts capped at $100 per recipient\n• Inventory management for items over $25 unit cost\n• Quality testing required for new vendors\n• Logo usage must follow brand standards\n• No weapons, alcohol, or tobacco-related items\n• Excess inventory donated to charity annually',
        hiddenNotes: 'Sales team has additional budget for client gifts. C-Suite gifts for partners/investors approved separately.',
      },
      {
        id: 'policy-6d',
        title: 'Sponsorships & Partnerships',
        description: '• Sponsorships over $25,000 require CMO and CFO approval\n• Due diligence on partner organizations required\n• Contract must specify deliverables and brand usage rights\n• Quarterly review of sponsorship effectiveness\n• Community sponsorships capped at $100,000 annually\n• Political contributions prohibited\n• Charitable giving follows separate CSR policy',
        hiddenNotes: 'CEO may approve strategic sponsorships up to $250,000. Board member charities eligible for matching grants.',
      },
    ],
  },
  {
    id: 'group-7',
    title: 'Facilities & Office Management Policy',
    policies: [
      {
        id: 'policy-7a',
        title: 'Office Supplies & Equipment',
        description: '• Standard supplies ordered through approved vendor portal\n• Specialty items over $100 require manager approval\n• Furniture requests follow standard configurations\n• Ergonomic assessments available upon request\n• Kitchen supplies budget: $500 per month per 50 employees\n• Printing/copying tracked by department for chargebacks\n• Personal items not reimbursable',
        hiddenNotes: 'Executive offices may have custom furniture. C-Suite assistants have higher supplies budget for executive needs.',
      },
      {
        id: 'policy-7b',
        title: 'Facilities Maintenance & Services',
        description: '• Preventive maintenance schedule strictly followed\n• Emergency repairs authorized up to $10,000 by Facilities Manager\n• Cleaning services follow daily/weekly/monthly schedule\n• HVAC settings: 68-72°F (special requests case-by-case)\n• Security services 24/7 for main offices\n• Parking allocation based on level and tenure\n• Office moves require 30-day notice and approval',
        hiddenNotes: 'Executive floor has enhanced cleaning and security. Reserved parking for C-Suite and Board members.',
      },
      {
        id: 'policy-7c',
        title: 'Space Planning & Allocation',
        description: '• Open office: 120 sq ft per person\n• Manager office: 150 sq ft\n• Director office: 200 sq ft\n• VP office: 300 sq ft\n• Conference room ratio: 1 per 20 employees\n• Phone booth ratio: 1 per 15 employees\n• Wellness room and mother room required per building code',
        hiddenNotes: 'C-Suite offices 500+ sq ft with private bathroom where possible. Board room separate from general conference rooms.',
      },
      {
        id: 'policy-7d',
        title: 'Workplace Safety & Emergency Procedures',
        description: '• Safety training required within 30 days of hire\n• Emergency evacuation drills quarterly\n• First aid kits inspected monthly\n• Incident reports filed within 24 hours\n• Workers compensation claims processed immediately\n• Ergonomic equipment provided with medical documentation\n• Building access cards deactivated immediately upon termination',
        hiddenNotes: 'Executive protection protocols for C-Suite during high-risk periods. Board members given security briefings.',
      },
    ],
  },
  {
    id: 'group-8',
    title: 'Legal & Compliance Policy',
    policies: [
      {
        id: 'policy-8a',
        title: 'Contract Management',
        description: '• All contracts require Legal review before signature\n• Standard templates must be used when possible\n• Deviations from standard terms documented and approved\n• Contract repository maintained with key dates tracked\n• Signature authority follows approval matrix\n• Electronic signatures acceptable for most agreements\n• Original contracts stored securely with Legal',
        hiddenNotes: 'CEO may sign without Legal review for Board-approved matters. Litigation settlements confidential with limited access.',
      },
      {
        id: 'policy-8b',
        title: 'Intellectual Property & Confidentiality',
        description: '• All employee creations are company property\n• Patent applications filed for novel inventions\n• Trademark searches required for new product names\n• Copyright notices on all published materials\n• NDAs required for all third-party discussions\n• Source code access restricted and logged\n• Trade secrets identified and protected',
        hiddenNotes: 'Founder agreements may have special IP carve-outs. Executive departures may negotiate limited IP rights.',
      },
      {
        id: 'policy-8c',
        title: 'Regulatory Compliance',
        description: '• Compliance training completed annually by all employees\n• Industry-specific regulations monitored quarterly\n• Government filings submitted per required schedule\n• Licenses and permits renewed 60 days before expiration\n• Compliance violations reported within 24 hours\n• External compliance audits conducted annually\n• Regulatory changes communicated within 7 days',
        hiddenNotes: 'Board members receive executive summary of compliance status. Material violations briefed immediately to CEO/Board.',
      },
      {
        id: 'policy-8d',
        title: 'Ethics & Code of Conduct',
        description: '• Annual ethics training and certification required\n• Conflicts of interest disclosed and reviewed\n• Gifts over $50 must be reported\n• Outside employment requires approval\n• Political activities not on company time/resources\n• Whistleblower hotline available 24/7\n• Retaliation prohibited and monitored\n• Investigations completed within 30 days',
        hiddenNotes: 'C-Suite conflicts reviewed by Board. Board conflicts reviewed by Governance Committee. Anonymous reporting protected.',
      },
    ],
  },
];

export const PoliciesPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [policyGroups, setPolicyGroups] = useState<PolicyGroupType[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Load policies from backend and set up WebSocket
  useEffect(() => {
    loadPolicies();
    
    // Set up WebSocket connection
    const wsClient = new WebSocketClient((data: any) => {
      if (data.event === 'policies:updated') {
        setPolicyGroups(data.data.groups || []);
      }
    });
    
    return () => wsClient.close();
  }, []);
  
  const loadPolicies = async () => {
    try {
      setLoading(true);
      const data = await api.getPolicies();
      setPolicyGroups(data.groups || initialData);
    } catch (error) {
      console.error('Failed to load policies, using initial data:', error);
      setPolicyGroups(initialData);
    } finally {
      setLoading(false);
    }
  };
  
  const savePolicies = async (groups: PolicyGroupType[]) => {
    try {
      await api.updatePolicies({ groups });
    } catch (error) {
      console.error('Failed to save policies:', error);
    }
  };



  const handleUpdateGroupTitle = async (groupId: string, newTitle: string) => {
    const updatedGroups = policyGroups.map((group) =>
      group.id === groupId ? { ...group, title: newTitle } : group
    );
    setPolicyGroups(updatedGroups);
    await savePolicies(updatedGroups);
  };

  const handleSelectGroup = (id: string) => {
    setSelectedGroupId(id);
  };

  const handleGoBack = () => {
    setSelectedGroupId(null);
  };

  const handleAddNewGroup = async () => {
    const newGroup: PolicyGroupType = {
      id: `group-${Date.now()}`,
      title: 'New Policy Group',
      policies: [],
    };
    const updatedGroups = [...policyGroups, newGroup];
    setPolicyGroups(updatedGroups);
    await savePolicies(updatedGroups);
  };

  const handleDeleteGroup = async (groupId: string) => {
    const groupToDelete = policyGroups.find(g => g.id === groupId);
    if (!groupToDelete) return;
    
    const confirmMessage = `Are you sure you want to delete "${groupToDelete.title}"? This will permanently delete all ${groupToDelete.policies.length} policies in this group.`;
    
    if (window.confirm(confirmMessage)) {
      const updatedGroups = policyGroups.filter(g => g.id !== groupId);
      setPolicyGroups(updatedGroups);
      await savePolicies(updatedGroups);
    }
  };

  const handleAddPolicy = async () => {
    if (!selectedGroupId) return;
    const newPolicy: Policy = {
      id: `policy-${Date.now()}`,
      title: 'New Policy Title',
      description: 'Add a description here.',
      hiddenNotes: '',
    };
    const updatedGroups = policyGroups.map((g) =>
      g.id === selectedGroupId ? { ...g, policies: [...g.policies, newPolicy] } : g
    );
    setPolicyGroups(updatedGroups);
    await savePolicies(updatedGroups);
  };

  const handleUpdatePolicy = async (updatedPolicy: Policy) => {
    if (!selectedGroupId) return;
    const updatedGroups = policyGroups.map((g) => {
      if (g.id === selectedGroupId) {
        return {
          ...g,
          policies: g.policies.map((p) => (p.id === updatedPolicy.id ? updatedPolicy : p)),
        };
      }
      return g;
    });
    setPolicyGroups(updatedGroups);
    await savePolicies(updatedGroups);
  };

  const handleDeletePolicy = async (policyId: string) => {
    if (!selectedGroupId) return;
    const updatedGroups = policyGroups.map((g) =>
      g.id === selectedGroupId
        ? { ...g, policies: g.policies.filter((p) => p.id !== policyId) }
        : g
    );
    setPolicyGroups(updatedGroups);
    await savePolicies(updatedGroups);
  };

  const selectedGroup = policyGroups.find((group) => group.id === selectedGroupId);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-500">Loading policies...</div>
      </div>
    );
  }

  return (
    <div>
      {selectedGroup ? (
        <PolicyDetailPage
          group={selectedGroup}
          onGoBack={handleGoBack}
          onUpdatePolicy={handleUpdatePolicy}
          onAddPolicy={handleAddPolicy}
          onDeletePolicy={handleDeletePolicy}
        />
      ) : (
        <AllPoliciesView
          groups={policyGroups}
          onSelectGroup={handleSelectGroup}
          onAddNewGroup={handleAddNewGroup}
          onUpdateGroupTitle={handleUpdateGroupTitle}
          onDeleteGroup={handleDeleteGroup}
          onBack={onBack}
        />
      )}
    </div>
  );
};
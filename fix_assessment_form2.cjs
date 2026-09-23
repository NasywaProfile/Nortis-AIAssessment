const fs = require('fs');
let content = fs.readFileSync('src/components/AssessmentForm.tsx', 'utf8');

content = content.replace(
  "interface AssessmentFormProps {\n  initialData?: FormData;\n  onBack: () => void;\n  onSubmit: (data: FormData) => void;\n}",
  "interface AssessmentFormProps {\n  assessmentType: 'organization' | 'individual';\n  initialData?: FormData;\n  onBack: () => void;\n  onSubmit: (data: FormData) => void;\n}"
);

content = content.replace(
  "export function AssessmentForm({ onBack, onSubmit, initialData }: AssessmentFormProps) {",
  "export function AssessmentForm({ assessmentType, initialData, onBack, onSubmit }: AssessmentFormProps) {"
);

content = content.replace(
  "export function AssessmentForm({ initialData, onBack, onSubmit }: AssessmentFormProps) {",
  "export function AssessmentForm({ assessmentType, initialData, onBack, onSubmit }: AssessmentFormProps) {"
);

const oldState = /const \[formData, setFormData\] = React\.useState<FormData>\(initialData \|\| \{[\s\S]*?phone: '',\s*\}\);/;
const newState = `const [formData, setFormData] = React.useState<FormData>(initialData || {
    assessmentType: assessmentType,
    companyName: '',
    industry: '',
    companySize: '',
    location: '',
    aiGoal: '',
    aiUseCase: '',
    aiTools: '',
    aiCurrentUse: '',
    aiFrequentUse: '',
    aiLearningNeed: '',
    aiMasteryTarget: '',
    timeline: '',
    fullName: '',
    jobTitle: '',
    email: '',
    phone: '',
    experienceYears: '',
    aiUsageFrequency: '',
    aiToolsUsed: '',
  });`;

content = content.replace(oldState, newState);

fs.writeFileSync('src/components/AssessmentForm.tsx', content);

export interface SubmitFormProps {
	action: (formData: FormData) => Promise<void>;
}

export interface RawFormProps {
	action: (formData: FormData) => Promise<void>;
	disabled: boolean;
}

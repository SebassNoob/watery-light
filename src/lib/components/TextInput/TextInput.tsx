import type { TextInputProps } from "./types";
export function TextInput({
	label,
	name,
	placeholder,
	value,
	onChange,
	className,
	...rest
}: TextInputProps) {
	return (
		<div className={className}>
			<label
				htmlFor="textinput"
				className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
			>
				{label}
			</label>
			<textarea
				id="textinput"
				name={name}
				value={value}
				onChange={onChange}
				placeholder={placeholder}
				{...rest}
				className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-violet-500 focus:border-violet-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-violet-500 dark:focus:border-violet-500 resize-none"
			/>
		</div>
	);
}

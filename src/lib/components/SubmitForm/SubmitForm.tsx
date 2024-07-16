"use client";
import {
	useContext,
	useRef,
	useState,
	type KeyboardEventHandler,
} from "react";
import { AuthContext } from "@lib/providers";
import { Button, TextInput, OAuthButton } from "@lib/components";
import type { SubmitFormProps, RawFormProps } from "./types";

function RawForm({ action, disabled }: RawFormProps) {
	const [messageEmpty, setMessageEmpty] = useState<boolean>(true);
	const submitButtonRef = useRef<HTMLButtonElement>(null);
	const handleEnterPress: KeyboardEventHandler<HTMLButtonElement> = e => {
		if (e.key === "Enter" && submitButtonRef.current) {
			e.preventDefault();
			e.stopPropagation();
			submitButtonRef.current.click();
		}
	};
	return (
		<form
			action={action}
			className="flex flex-col items-center justify-center gap-4  mx-auto"
			onSubmit={e => setMessageEmpty(true)}
		>
			<TextInput
				name="message"
				label="Upload Post"
				placeholder="Enter something inspiring..."
				disabled={disabled}
				onChange={e => setMessageEmpty(e.target.value === "")}
				className="w-full"
			/>
			<Button
				type="submit"
				disabled={disabled || messageEmpty}
				className="w-auto"
				onKeyDown={handleEnterPress}
				ref={submitButtonRef}
			>
				Submit
			</Button>
		</form>
	);
}

export function SubmitForm({ action }: SubmitFormProps) {
	const { user } = useContext(AuthContext);

	if (user) {
		return (
			<div className="p-4 min-w-48">
				<RawForm action={action} disabled={false} />
			</div>
		);
	}
	return (
		<div className="relative p-4 min-w-48">
			<div className="absolute inset-0 bg-white bg-opacity-30 backdrop-filter backdrop-blur-sm flex gap-2 justify-center items-center rounded-md z-10">
				<OAuthButton.Discord />
				<OAuthButton.Google />
			</div>
			<RawForm action={action} disabled={true} />
		</div>
	);
}

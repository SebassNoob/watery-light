import type { OAuthButtonProps, SizedSocialIconProps } from "./types";
import { Button } from "@lib/components";
import { discordSignin, googleSignin, githubSignin } from "@lib/actions";

import Image from "next/image";

function _SizedSocialIcon({ path }: SizedSocialIconProps) {
	return (
		<div>
			<Image src={path} width={24} height={24} alt={path} />
		</div>
	);
}

function _OAuthButton({ name, path, action }: OAuthButtonProps) {
	const serverAction = action.bind(null);
	return (
		<form action={serverAction}>
			<Button type="submit" className="flex gap-1 items-center">
				<_SizedSocialIcon path={path} />
				Sign in with {name}
			</Button>
		</form>
	);
}

export class OAuthButton {
	static Discord() {
		return _OAuthButton({
			name: "Discord",
			path: "/icons/discord.svg",
			action: discordSignin,
		});
	}
	static GitHub() {
		return _OAuthButton({
			name: "GitHub",
			path: "/icons/github.svg",
			action: githubSignin,
		});
	}
	static Google() {
		return _OAuthButton({
			name: "Google",
			path: "/icons/google.svg",
			action: googleSignin,
		});
	}
}

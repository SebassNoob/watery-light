import type { OAuthButtonProps, SizedSocialIconProps } from "./types";
import { Button } from "@lib/components";

import { discordSignin, googleSignin, githubSignin } from "@lib/actions";

import { SocialIcon } from "react-social-icons";
import "react-social-icons/discord";
import "react-social-icons/github";
import "react-social-icons/google";

function _SizedSocialIcon({ network }: SizedSocialIconProps) {
	return (
		<div>
			<SocialIcon network={network} style={{ height: 24, width: 24 }} />
		</div>
	);
}

function _oAuthButton({ network, provider, action }: OAuthButtonProps) {
	const serverAction = action.bind(null);
	return (
		<form action={serverAction}>
			<Button type="submit" className="flex gap-1 items-center">
				<_SizedSocialIcon network={network} />
				Sign in with {provider}
			</Button>
		</form>
	);
}

export class OAuthButton {
	static Discord() {
		return _oAuthButton({
			network: "discord",
			provider: "Discord",
			action: discordSignin,
		});
	}
	static GitHub() {
		return _oAuthButton({
			network: "github",
			provider: "GitHub",
			action: githubSignin,
		});
	}
	static Google() {
		return _oAuthButton({
			network: "google",
			provider: "Google",
			action: googleSignin,
		});
	}
}

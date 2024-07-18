export interface OAuthButtonProps {
	name: string;
	path: string;
	action: () => Promise<void>;
}

export interface SizedSocialIconProps {
	path: OAuthButtonProps["path"];
}

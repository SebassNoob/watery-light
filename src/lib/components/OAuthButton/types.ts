export interface OAuthButtonProps {
	network: string;
	provider: string;
	action: () => Promise<void>;
}

export interface SizedSocialIconProps {
	network: string;
}

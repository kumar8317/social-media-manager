export interface VideoMetadata {
    title: string;
    description: string;
    tags?: string[];
    privacyStatus?: 'private' | 'unlisted' | 'public';
}
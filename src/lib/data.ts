import type { Project } from './types';
import { PlaceHolderImages } from './placeholder-images';

const getImage = (id: string) => {
    const placeholder = PlaceHolderImages.find(p => p.id === id);
    return {
        url: placeholder?.imageUrl || `https://picsum.photos/seed/${id}/400/200`,
        hint: placeholder?.imageHint || 'abstract',
    };
};

export const projects: Project[] = [];

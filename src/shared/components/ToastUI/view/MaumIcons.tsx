import { createElement } from 'react';
import * as Icons from 'lucide-react';

interface MaumIconsProps {
  icon: keyof typeof Icons;

  className?: string;
  size?: number;
  color?: string;
  strokeWidth?: number;
  title?: string;
}

function MaumIcons(props: MaumIconsProps) {
  try {
    const { icon, className, title, ...computedProps } = props;

    const SelectedIcon = Icons[icon] as any;

    if (SelectedIcon !== undefined) {
      return createElement(SelectedIcon, {
        ...computedProps,
        className: `maum-icons ${props.className}`,
        title: props.title,
      });
    } else {
      throw props.icon;
    }
  } catch (err) {
    throw `icon '${props.icon}' not found.`;
  }
}

export default MaumIcons;

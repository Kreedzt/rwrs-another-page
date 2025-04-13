import * as React from 'preact/compat';

declare module '@radix-ui/react-icons' {
  // Define a base type for all icon components
  type IconComponent = React.ForwardRefExoticComponent<
    React.SVGAttributes<SVGElement> & {
      className?: string;
    } & React.RefAttributes<SVGSVGElement>
  >;

  // Apply the type to all exported icon components
  // Explicitly list the icons we know are used in the project
  export const ChevronDownIcon: IconComponent;
  export const ChevronRightIcon: IconComponent;
  export const ChevronLeftIcon: IconComponent;
  export const CheckIcon: IconComponent;
  export const Cross2Icon: IconComponent;
  export const DotFilledIcon: IconComponent;
  export const DotsHorizontalIcon: IconComponent;
  export const MagnifyingGlassIcon: IconComponent;
  export const QuestionMarkCircledIcon: IconComponent;

  // Additional icons that might be used
  export const ArrowDownIcon: IconComponent;
  export const ArrowLeftIcon: IconComponent;
  export const ArrowRightIcon: IconComponent;
  export const ArrowUpIcon: IconComponent;
  export const CalendarIcon: IconComponent;
  export const CaretDownIcon: IconComponent;
  export const CaretLeftIcon: IconComponent;
  export const CaretRightIcon: IconComponent;
  export const CaretSortIcon: IconComponent;
  export const CaretUpIcon: IconComponent;
  export const ChatBubbleIcon: IconComponent;
  export const CheckCircledIcon: IconComponent;
  export const ClockIcon: IconComponent;
  export const Cross1Icon: IconComponent;
  export const CrossCircledIcon: IconComponent;
  export const EnterIcon: IconComponent;
  export const ExitIcon: IconComponent;
  export const ExternalLinkIcon: IconComponent;
  export const EyeClosedIcon: IconComponent;
  export const EyeOpenIcon: IconComponent;
  export const GearIcon: IconComponent;
  export const HomeIcon: IconComponent;
  export const InfoCircledIcon: IconComponent;
  export const LinkBreak1Icon: IconComponent;
  export const LinkBreak2Icon: IconComponent;
  export const LinkNone1Icon: IconComponent;
  export const LinkNone2Icon: IconComponent;
  export const MoonIcon: IconComponent;
  export const PersonIcon: IconComponent;
  export const PlusIcon: IconComponent;
  export const ReloadIcon: IconComponent;
  export const SunIcon: IconComponent;
  export const TriangleDownIcon: IconComponent;
  export const TriangleUpIcon: IconComponent;
  export const UpdateIcon: IconComponent;
  export const UploadIcon: IconComponent;

  // Unfortunately, we can't use a wildcard type in a module declaration
  // But the explicitly listed icons above should cover most use cases
  // Add more icons as needed
}

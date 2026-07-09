import React from "react";
import * as Icons from "./ProductIcons";

interface IconRendererProps extends Icons.IconProps {
  type: string;
}

export function IconRenderer({ type, size = 24, className = "", ...props }: IconRendererProps) {
  const normalized = type.toLowerCase();
  
  switch (normalized) {
    case "rice":
      return <Icons.RiceIcon size={size} className={className} {...props} />;
    case "coffee":
      return <Icons.CoffeeIcon size={size} className={className} {...props} />;
    case "spice":
      return <Icons.SpiceIcon size={size} className={className} {...props} />;
    case "oil":
      return <Icons.OilIcon size={size} className={className} {...props} />;
    case "honey":
      return <Icons.HoneyIcon size={size} className={className} {...props} />;
    case "grain":
      return <Icons.GrainIcon size={size} className={className} {...props} />;
    case "leaf":
      return <Icons.LeafIcon size={size} className={className} {...props} />;
    case "factory":
      return <Icons.FactoryIcon size={size} className={className} {...props} />;
    case "star":
      return <Icons.StarIcon size={size} className={className} {...props} />;
    case "heart":
      return <Icons.HeartIcon size={size} className={className} {...props} />;
    case "cart":
      return <Icons.CartIcon size={size} className={className} {...props} />;
    case "package":
      return <Icons.PackageIcon size={size} className={className} {...props} />;
    case "bell":
      return <Icons.BellIcon size={size} className={className} {...props} />;
    case "truck":
      return <Icons.TruckIcon size={size} className={className} {...props} />;
    case "location":
      return <Icons.LocationIcon size={size} className={className} {...props} />;
    case "lock":
      return <Icons.LockIcon size={size} className={className} {...props} />;
    case "user":
      return <Icons.UserIcon size={size} className={className} {...props} />;
    case "camera":
      return <Icons.CameraIcon size={size} className={className} {...props} />;
    case "save":
      return <Icons.SaveIcon size={size} className={className} {...props} />;
    case "edit":
      return <Icons.EditIcon size={size} className={className} {...props} />;
    case "dollar":
      return <Icons.DollarIcon size={size} className={className} {...props} />;
    case "trash":
      return <Icons.TrashIcon size={size} className={className} {...props} />;
    default:
      return <Icons.PackageIcon size={size} className={className} {...props} />;
  }
}

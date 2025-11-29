import { Injectable } from '@angular/core';

export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  icon?: string;
  url?: string;
  classes?: string;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  children?: Navigation[];
}

export interface Navigation extends NavigationItem {
  children?: NavigationItem[];
}
const NavigationItems = [
  {
    id: 'dashboard',
    title: 'ProductHub Admin System',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'usermanagement',
        title: 'User Management',
        type: 'item',
        classes: 'nav-item',
        url: '/user',
        icon: 'ti ti-user'  
      },

        {
        id: 'category',
        title: 'Category Management',
        type: 'item',
        classes: 'nav-item',
        url: '/category',
        icon: 'ti ti-category'  
      },

       {
        id: 'product',
        title: 'Product Management',
        type: 'item',
        classes: 'nav-item',
        url: '/product',
        icon: 'ti ti-package'  
      },
    ]
  },
];

@Injectable()
export class NavigationItem {
  get() {
    return NavigationItems;
  }
}

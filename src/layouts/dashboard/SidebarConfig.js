import { Icon } from '@iconify/react';
import pieChart2Fill from '@iconify/icons-eva/pie-chart-2-fill';
import peopleFill from '@iconify/icons-eva/people-fill';
import shoppingBagFill from '@iconify/icons-eva/shopping-bag-fill';
import fileTextFill from '@iconify/icons-eva/file-text-fill';
import logoutFill from '@iconify/icons-eva/log-out-fill';

// ----------------------------------------------------------------------

const getIcon = (name) => <Icon icon={name} width={22} height={22} />;

const sidebarConfig = [
  {
    title: 'dashboard',
    path: '/app',
    icon: getIcon(pieChart2Fill)
  },
  {
    title: 'user',
    path: '/user',
    icon: getIcon(peopleFill)
  },
  {
    title: 'product',
    path: '/products',
    icon: getIcon(shoppingBagFill)
  },
  {
    title: 'blog',
    path: '/blog',
    icon: getIcon(fileTextFill)
  },
  {
    title: 'logout',
    path: '/logout',
    icon: getIcon(logoutFill)
  }
];

export default sidebarConfig;

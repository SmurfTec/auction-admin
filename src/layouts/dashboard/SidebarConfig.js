import { Icon } from '@iconify/react';
import pieChart2Fill from '@iconify/icons-eva/pie-chart-2-fill';
import peopleFill from '@iconify/icons-eva/people-fill';
import logoutFill from '@iconify/icons-eva/log-out-fill';
import otherFill from '@iconify/icons-eva/options-2-fill';
import AuctionsFill from '@iconify/icons-eva/pantone-fill';
import CategoriesFill from '@iconify/icons-eva/bar-chart-2-fill';
import contactFill from '@iconify/icons-eva/message-circle-outline';
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
    title: 'auction',
    path: '/auctions',
    icon: getIcon(AuctionsFill)
  },
  {
    title: 'categories',
    path: '/categories',
    icon: getIcon(CategoriesFill)
  },
  {
    title: 'contacts',
    path: '/contacts',
    icon: getIcon(contactFill)
  },
  // {
  //   title: 'others',
  //   path: '/others',
  //   icon: getIcon(otherFill)
  // },
  {
    title: 'logout',
    path: '/logout',
    icon: getIcon(logoutFill)
  }
];

export default sidebarConfig;

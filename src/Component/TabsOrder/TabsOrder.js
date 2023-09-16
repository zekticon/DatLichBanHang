import { styled } from '@mui/system';
import className from 'classnames/bind';
import TabsUnstyled from '@mui/base/TabsUnstyled';
import TabsListUnstyled from '@mui/base/TabsListUnstyled';
import TabPanelUnstyled from '@mui/base/TabPanelUnstyled';
import { buttonUnstyledClasses } from '@mui/base/ButtonUnstyled';
import TabUnstyled, { tabUnstyledClasses } from '@mui/base/TabUnstyled';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import styles from './TabsOrder.module.scss';
import DatatableOrder from '~/admin/components/datatable/DatatableOrder';

const cx = className.bind(styles);

const blue = {
    50: '#F0F7FF',
    100: '#C2E0FF',
    200: '#80BFFF',
    300: '#66B2FF',
    400: '#3399FF',
    500: '#007FFF',
    600: '#0072E5',
    700: '#0059B2',
    800: '#004C99',
    900: '#003A75',
};

const grey = {
    50: '#f6f8fa',
    100: '#eaeef2',
    200: '#d0d7de',
    300: '#afb8c1',
    400: '#8c959f',
    500: '#6e7781',
    600: '#57606a',
    700: '#424a53',
    800: '#32383f',
    900: '#24292f',
};

const Tab = styled(TabUnstyled)`
    font-family: IBM Plex Sans, sans-serif;
    color: white;
    cursor: pointer;
    font-size: 1.2rem;
    font-weight: bold;
    background-color: transparent;
    width: fit-content;
    padding: 12px;
    margin: 6px 6px;
    border: none;
    border-radius: 7px;
    display: flex;
    justify-content: start;

    &:hover {
        background-color: #6f869d;
    }

    &:focus {
        color: #fff;
        outline: 3px solid ${blue[200]};
    }

    &.${tabUnstyledClasses.selected} {
        background-color: #fff;
        color: #83a0bd;
    }

    &.${buttonUnstyledClasses.disabled} {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

const TabPanel = styled(TabPanelUnstyled)`
    width: 100%;
    font-family: IBM Plex Sans, sans-serif;
    display: flex;
    overflow: hidden;
    flex-wrap: wrap;
    flex-direction: column;
    justify-content: center;
    font-size: 1.875rem;
`;

const TabsList = styled(TabsListUnstyled)(
    ({ theme }) => `
  width: 97%;
    margin: 0 auto;
      background-color: #aebdc9;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: start;
  align-content: space-between;
  box-shadow: 0px 4px 8px ${theme.palette.mode === 'dark' ? grey[900] : grey[200]};
  `,
);

function TabsOrder(props) {
    const { data, children, value, index, ...other } = props;

    return (
        <TabsUnstyled defaultValue={0}>
            <TabsList>
                <Tab>ĐƠN HÀNG MỚI</Tab>
                <Tab>CHUẨN BỊ</Tab>
                <Tab>VẬN CHUYỂN</Tab>
            </TabsList>
            <TabPanel value={0}>
                <DatatableOrder action="new" />
            </TabPanel>
            <TabPanel value={1}>
                <DatatableOrder action="process" />
            </TabPanel>
            <TabPanel value={2}>
                <DatatableOrder action="shipping" />
            </TabPanel>
        </TabsUnstyled>
    );
}

export default TabsOrder;

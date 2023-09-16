import { styled } from '@mui/system';
import className from 'classnames/bind';
import TabsUnstyled from '@mui/base/TabsUnstyled';
import TabsListUnstyled from '@mui/base/TabsListUnstyled';
import TabPanelUnstyled from '@mui/base/TabPanelUnstyled';
import { buttonUnstyledClasses } from '@mui/base/ButtonUnstyled';
import TabUnstyled, { tabUnstyledClasses } from '@mui/base/TabUnstyled';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import styles from './TabsStyle.module.scss';

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
        background-color: ${blue[400]};
    }

    &:focus {
        color: #fff;
        outline: 3px solid ${blue[200]};
    }

    &.${tabUnstyledClasses.selected} {
        background-color: #fff;
        color: ${blue[600]};
    }

    &.${buttonUnstyledClasses.disabled} {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

const TabPanel = styled(TabPanelUnstyled)`
    width: 1022px;
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
  min-width: 400px;
      background-color: #216daa;
  border-radius: 12px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: start;
  align-content: space-between;
  box-shadow: 0px 4px 8px ${theme.palette.mode === 'dark' ? grey[900] : grey[200]};
  `,
);

function TabsStyle(props) {
    const { data, children, value, index, ...other } = props;

    return (
        <TabsUnstyled defaultValue={0}>
            <TabsList>
                <Tab>MÔ TẢ</Tab>
                {data.Html.specification && <Tab>THÔNG SỐ/THÀNH PHẦN</Tab>}
                {data.Html.feature && <Tab>ĐẶC ĐIỂM CHÍNH </Tab>}
                {data.Html.assign && <Tab>CHỈ ĐỊNH </Tab>}
                {/* <Tab>HỎI ĐÁP (2)</Tab> */}
            </TabsList>
            <TabPanel value={0}>
                <div className={cx('wrapper')}>
                    <div className={cx('title')}>{data.title}</div>
                    <div className={cx('group-info')}>
                        {data.brand && (
                            <div className={cx('content')}>
                                <div className={cx('content-left')}>
                                    <CheckCircleIcon className={cx('icon')} />

                                    <strong>Xuất xứ:</strong>
                                </div>
                                <div className={cx('content-right')}>
                                    <p>{data.brand}</p>
                                </div>
                            </div>
                        )}
                        {data.type && (
                            <div className={cx('content')}>
                                <div className={cx('content-left')}>
                                    <CheckCircleIcon className={cx('icon')} />

                                    <strong>Loại:</strong>
                                </div>
                                <div className={cx('content-right')}>
                                    <p>{data.type}</p>
                                </div>
                            </div>
                        )}
                        {data.unit && (
                            <div className={cx('content')}>
                                <div className={cx('content-left')}>
                                    <CheckCircleIcon className={cx('icon')} />

                                    <strong>Quy cách:</strong>
                                </div>
                                <div className={cx('content-right')}>
                                    <p>{data.unit}</p>
                                </div>
                            </div>
                        )}
                    </div>
                    {data.Html.description && (
                        <div
                            className={cx('description')}
                            dangerouslySetInnerHTML={{
                                __html: data.Html.description,
                            }}
                        ></div>
                    )}
                    {data.Html.specification && (
                        <>
                            <div className={cx('title')}>THÔNG SỐ/THÀNH PHẦN</div>
                            <div
                                className={cx('description')}
                                dangerouslySetInnerHTML={{
                                    __html: data.Html.specification,
                                }}
                            ></div>
                        </>
                    )}
                    {data.Html.feature && (
                        <>
                            {' '}
                            <div className={cx('title')}>ĐẶC ĐIỂM CHÍNH</div>
                            <div
                                className={cx('description')}
                                dangerouslySetInnerHTML={{
                                    __html: data.Html.feature,
                                }}
                            ></div>
                        </>
                    )}
                    {data.Html.assign && (
                        <>
                            {' '}
                            <div className={cx('title')}>CHỈ ĐỊNH</div>
                            <div
                                className={cx('description')}
                                dangerouslySetInnerHTML={{
                                    __html: data.Html.assign,
                                }}
                            ></div>
                        </>
                    )}
                </div>
            </TabPanel>
            {data.Html.specification && (
                <TabPanel value={1}>
                    <div className={cx('wrapper')}>
                        <div className={cx('title')}>THÔNG SỐ/THÀNH PHẦN</div>

                        {data.Html.specification && (
                            <div
                                className={cx('description')}
                                dangerouslySetInnerHTML={{
                                    __html: data.Html.specification,
                                }}
                            ></div>
                        )}
                    </div>
                </TabPanel>
            )}
            {data.Html.feature && (
                <TabPanel value={2}>
                    <div className={cx('wrapper')}>
                        <div className={cx('title')}>ĐẶC ĐIỂM CHÍNH</div>

                        {data.Html.feature && (
                            <div
                                className={cx('description')}
                                dangerouslySetInnerHTML={{
                                    __html: data.Html.feature,
                                }}
                            ></div>
                        )}
                    </div>
                </TabPanel>
            )}
            {data.Html.assign && (
                <TabPanel value={3}>
                    <div className={cx('wrapper')}>
                        <div className={cx('title')}>CHỈ ĐỊNH</div>

                        {data.Html.assign && (
                            <div
                                className={cx('description')}
                                dangerouslySetInnerHTML={{
                                    __html: data.Html.assign,
                                }}
                            ></div>
                        )}
                    </div>
                </TabPanel>
            )}
        </TabsUnstyled>
    );
}

export default TabsStyle;

import './Chart.scss';
import { AreaChart, Area, XAxis, CartesianGrid, Tooltip, ResponsiveContainer, YAxis } from 'recharts';
import { curveCardinal } from 'd3-shape';
import { useEffect, useState } from 'react';
import { getTurnoverWeek } from '~/services';
import moment from 'moment';
import { NumericFormat } from 'react-number-format';
import localization from 'moment/locale/vi';

function Chart() {
    const cardinal = curveCardinal.tension(0.2);

    const [week, setWeek] = useState([]);

    const fetchApi = async () => {
        const res = await getTurnoverWeek();
        if (res.errCode === 0) {
            let groupDate = res.data.reverse();
            groupDate.forEach((item) => {
                item.createdAt = moment(item.createdAt).format('DD/MM/YYYY');
                return item;
            });

            let output = groupByArray(groupDate, 'createdAt');
            if (output && output.length > 0) {
                let arr = [];

                output.forEach((item) => {
                    arr.push({
                        name: item.key,
                        sold: item.values && item.values.length > 0 ? item.values.length : 0,
                        total:
                            item.values && item.values.length > 0
                                ? item.values.reduce((a, b) => {
                                      return a + b;
                                  })
                                : 0,
                    });
                    return arr;
                });

                setWeek(arr);
            }
        }
    };
    const groupByArray = (arr, key) => {
        return arr.reduce((rv, x) => {
            let v = key instanceof Function ? key(x) : x[key];
            let el = rv.find((r) => r && r.key === v);
            if (el) {
                el.values.push(x.sub_total);
            } else {
                rv.push({
                    key: v,
                    values: [x.sub_total],
                });
            }
            return rv;
        }, []);
    };

    useEffect(() => {
        fetchApi();
    }, []);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip">
                    <p className="label">{`${label}`}</p>

                    <p className="desc">
                        {`Doanh thu: `}
                        <NumericFormat
                            className="currency"
                            type="text"
                            value={payload[0].value}
                            displayType="text"
                            thousandSeparator={true}
                            suffix={'đ'}
                        />
                    </p>
                </div>
            );
        }

        return null;
    };
    const CustomTooltipSold = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip">
                    <p className="label">{`${label}`}</p>

                    <p className="desc">
                        {`Đã bán: `}
                        {payload[0].value}
                    </p>
                </div>
            );
        }

        return null;
    };

    return (
        <div className="chart">
            <div style={{ width: '100%' }}>
                <h4 className="text-[#c36985] font-bold">Doanh thu trong 7 ngày gần đây</h4>
                <ResponsiveContainer width="90%" height={200}>
                    <AreaChart
                        width={500}
                        height={200}
                        data={week}
                        syncId="anyId"
                        margin={{
                            top: 10,
                            right: 30,
                            left: 30,
                            bottom: 0,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Area type="monotone" dataKey="total" stroke="#8884d8" fill="#8884d8" />
                    </AreaChart>
                </ResponsiveContainer>
                <p className="text-[#c36985] font-bold">Số lượng đơn bán trong 7 ngày gần đây</p>

                <ResponsiveContainer width="90%" height={200}>
                    <AreaChart
                        width={500}
                        height={200}
                        data={week}
                        syncId="anyId"
                        margin={{
                            top: 10,
                            right: 30,
                            left: 30,
                            bottom: 0,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip content={<CustomTooltipSold />} />
                        <Area type="monotone" dataKey="sold" stroke="#82ca9d" fill="#82ca9d" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default Chart;

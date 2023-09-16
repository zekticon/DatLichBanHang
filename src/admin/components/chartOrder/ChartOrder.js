import './ChartOrder.scss';
import { XAxis, CartesianGrid, Tooltip, ResponsiveContainer, YAxis, BarChart, Bar, Legend } from 'recharts';
import { curveCardinal } from 'd3-shape';
import { useEffect, useState } from 'react';
import { getProductOrder, getTurnoverWeek } from '~/services';
import moment from 'moment';
import { NumericFormat } from 'react-number-format';
import localization from 'moment/locale/vi';

const data = [
    {
        name: 'Page A',
        uv: 4000,
        pv: 2400,
        amt: 2400,
    },
    {
        name: 'Page B',
        uv: 3000,
        pv: 1398,
        amt: 2210,
    },
    {
        name: 'Page C',
        uv: 2000,
        pv: 9800,
        amt: 2290,
    },
    {
        name: 'Page D',
        uv: 2780,
        pv: 3908,
        amt: 2000,
    },
    {
        name: 'Page E',
        uv: 1890,
        pv: 4800,
        amt: 2181,
    },
    {
        name: 'Page F',
        uv: 2390,
        pv: 3800,
        amt: 2500,
    },
    {
        name: 'Page G',
        uv: 3490,
        pv: 4300,
        amt: 2100,
    },
];

function ChartOrder() {
    const cardinal = curveCardinal.tension(0.2);

    const [week, setWeek] = useState([]);

    const slipt = (str) => {
        let arrStr = str.split(' ');

        let arrNew = [];
        for (let i = 0; i < 4; i++) {
            arrNew.push(arrStr[i]);
        }

        return arrNew.join(' ') + '...';
    };

    const fetchApi = async () => {
        const res = await getProductOrder();
        if (res.errCode === 0) {
            let groupProduct = res.data;
            groupProduct.forEach((item) => {
                item.createdAt = moment(item.createdAt).format('DD/MM/YYYY');
                return item;
            });

            let output = groupByArray(groupProduct, 'product_id');
            slipt(output[1].title);
            if (output && output.length > 0) {
                let arr = [];

                output.forEach((item) => {
                    arr.push({
                        name: item.title.length > 28 ? slipt(item.title) : item.title,
                        sold: item.sold && item.sold.length > 0 ? item.sold.length : 0,
                        total:
                            item.sold && item.sold.length > 0
                                ? item.sold.reduce((a, b) => {
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
                el.sold.push(x.quantity);
            } else {
                rv.push({
                    key: v,
                    title: x.imageData.title,
                    sold: [x.quantity],
                });
            }
            return rv;
        }, []);
    };

    useEffect(() => {
        fetchApi();
    }, []);

    return (
        <div className="h-[400px] w-full flex flex-col gap-4">
            <h1 className="text-[#c36985] font-bold ml-[20px]">Sản phẩm đã bán trong 7 ngày gần đây</h1>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    width={500}
                    height={300}
                    data={week}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                    barSize={20}
                >
                    <XAxis
                        dataKey="name"
                        scale="point"
                        width={30}
                        fontSize={10}
                        overflow="hidden"
                        padding={{ left: 10, right: 10 }}
                    />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Bar dataKey="total" fill="#60eafb" background={{ fill: '#eee' }} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

export default ChartOrder;

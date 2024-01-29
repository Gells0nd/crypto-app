import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { Card, Layout, List, Spin, Statistic, Tag, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { fakeFetchAssets, fakeFetchCrypto } from '../../api';
import { capitalize, percentDifference } from '../../utils';

const siderStyle = {
	padding: '1rem',
};

const AppSider = () => {
	const [loading, setLoading] = useState(false);
	const [crypto, setCrypto] = useState([]);
	const [assets, setAssets] = useState([]);

	useEffect(() => {
		async function preload() {
			setLoading(true);
			const { result } = await fakeFetchCrypto();
			const assets = await fakeFetchAssets();

			setAssets(
				assets.map(asset => {
					const coin = result.find(c => c.id === asset.id);
					return {
						grow: asset.price < coin.price,
						growPercent: percentDifference(asset.price, coin.price),
						totalAmount: asset.amount * coin.price,
						totalProfit: asset.amount * coin.price - asset.amount * asset.price,
						...asset,
					};
				}),
			);
			setCrypto(result);
			setLoading(false);
		}
		preload();
	}, []);

	if (loading) {
		return <Spin fullscreen />;
	}

	return (
		<Layout.Sider width='25%' style={siderStyle}>
			{assets.map(asset => (
				<Card key={asset.id} style={{ marginBottom: '1rem' }}>
					<Statistic
						title={capitalize(asset.id)}
						value={asset.totalAmount}
						precision={2}
						valueStyle={{ color: asset.grow ? '#3f8600' : '#cf1322' }}
						prefix={asset.grow ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
						suffix='$'
					/>
					<List
						size='small'
						dataSource={[
							{
								title: 'Total Profit',
								value: asset.totalProfit,
								widthTag: true,
							},
							{ title: 'Asset Amount', value: asset.amount, isPlain: true },
						]}
						renderItem={item => (
							<List.Item
								style={{ display: 'flex', justifyContent: 'space-between' }}
							>
								<span>{item.title}</span>
								<span>
									{item.widthTag && (
										<Tag color={asset.grow ? 'green' : 'red'}>
											{asset.growPercent}%
										</Tag>
									)}
									{item.isPlain && item.value}
									{!item.isPlain && (
										<Typography.Text type={asset.grow ? 'success' : 'danger'}>
											{item.value.toFixed(2)}$
										</Typography.Text>
									)}
								</span>
							</List.Item>
						)}
					/>
				</Card>
			))}
		</Layout.Sider>
	);
};

export default AppSider;

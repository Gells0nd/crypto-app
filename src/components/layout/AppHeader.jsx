import { Button, Drawer, Layout, Modal, Select, Space } from 'antd';
import { useEffect, useState } from 'react';
import { useCrypto } from '../../context/crypto-context';
import AddAssetForm from '../AddAssetForm';
import CoinInfoModal from '../CoinInfoModal';

const headerStyle = {
	width: '100%',
	textAlign: 'center',
	height: '60px',
	padding: '1rem',
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
};

const AppHeader = () => {
	const [select, setSelect] = useState(false);
	const [modal, setModal] = useState(false);
	const [drawer, setDrawer] = useState(false);
	const [coin, setCoin] = useState(null);
	const { crypto } = useCrypto();

	useEffect(() => {
		const keypress = event => {
			if (event.key === '/') {
				setSelect(prev => !prev);
			}
		};
		document.addEventListener('keypress', keypress);
		return () => document.removeEventListener('keypress', keypress);
	}, []);

	function handleSelect(value) {
		setCoin(crypto.find(c => c.id === value));
		setModal(true);
	}

	return (
		<Layout.Header style={headerStyle}>
			<Select
				style={{
					width: '250px',
				}}
				value='press / to open'
				open={select}
				onSelect={handleSelect}
				onClick={() => setSelect(prev => !prev)}
				options={crypto.map(coin => ({
					label: coin.name,
					value: coin.id,
					icon: coin.icon,
				}))}
				optionRender={option => (
					<Space>
						<img
							style={{ width: '20px' }}
							src={option.data.icon}
							alt={option.data.label}
						/>
						{option.data.label}
					</Space>
				)}
			/>
			<Button onClick={() => setDrawer(prev => !prev)} type='primary'>
				Add Asset
			</Button>

			<Modal open={modal} onCancel={() => setModal(false)} footer={null}>
				<CoinInfoModal coin={coin} />
			</Modal>

			<Drawer
				title='Add Asset'
				width={600}
				onClose={() => setDrawer(false)}
				open={drawer}
			>
				<AddAssetForm />
			</Drawer>
		</Layout.Header>
	);
};

export default AppHeader;

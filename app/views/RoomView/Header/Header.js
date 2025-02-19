import React from 'react';
import PropTypes from 'prop-types';
import {
	View, Text, StyleSheet, ScrollView, TouchableOpacity
} from 'react-native';
import { shortnameToUnicode } from 'emoji-toolkit';
import removeMarkdown from 'remove-markdown';

import I18n from '../../../i18n';
import sharedStyles from '../../Styles';
import { isIOS, isAndroid, isTablet } from '../../../utils/deviceInfo';
import Icon from './Icon';
import { COLOR_TEXT_DESCRIPTION, HEADER_TITLE, COLOR_WHITE } from '../../../constants/colors';

const androidMarginLeft = isTablet ? 0 : 10;

const TITLE_SIZE = 16;
const styles = StyleSheet.create({
	container: {
		flex: 1,
		height: '100%',
		marginRight: isAndroid ? 15 : 5,
		marginLeft: isAndroid ? androidMarginLeft : -12
	},
	titleContainer: {
		flex: 6,
		flexDirection: 'row'
	},
	threadContainer: {
		marginRight: isAndroid ? 20 : undefined
	},
	title: {
		...sharedStyles.textSemibold,
		color: HEADER_TITLE,
		fontSize: TITLE_SIZE
	},
	scroll: {
		alignItems: 'center'
	},
	typing: {
		...sharedStyles.textRegular,
		color: isIOS ? COLOR_TEXT_DESCRIPTION : COLOR_WHITE,
		fontSize: 12,
		flex: 4
	},
	typingUsers: {
		...sharedStyles.textSemibold
	}
});

const Typing = React.memo(({ usersTyping }) => {
	let usersText;
	if (!usersTyping.length) {
		return null;
	} else if (usersTyping.length === 2) {
		usersText = usersTyping.join(` ${ I18n.t('and') } `);
	} else {
		usersText = usersTyping.join(', ');
	}
	return (
		<Text style={styles.typing} numberOfLines={1}>
			<Text style={styles.typingUsers}>{usersText} </Text>
			{ usersTyping.length > 1 ? I18n.t('are_typing') : I18n.t('is_typing') }...
		</Text>
	);
});

Typing.propTypes = {
	usersTyping: PropTypes.array
};

const HeaderTitle = React.memo(({
	title, scale, connecting
}) => {
	if (connecting) {
		title = I18n.t('Connecting');
	}
	return (
		<Text
			style={[styles.title, { fontSize: TITLE_SIZE * scale }]}
			numberOfLines={1}
			testID={`room-view-title-${ title }`}
		>{title}
		</Text>
	);
});

HeaderTitle.propTypes = {
	title: PropTypes.string,
	scale: PropTypes.number,
	connecting: PropTypes.bool
};

const Header = React.memo(({
	title, type, status, usersTyping, width, height, prid, tmid, widthOffset, connecting, goRoomActionsView
}) => {
	const portrait = height > width;
	let scale = 1;

	if (!portrait && !tmid) {
		if (usersTyping.length > 0) {
			scale = 0.8;
		}
	}
	if (title) {
		title = shortnameToUnicode(title);
		if (tmid) {
			title = removeMarkdown(title);
		}
	}

	const onPress = () => {
		if (!tmid) {
			goRoomActionsView();
		}
	};

	return (
		<TouchableOpacity onPress={onPress} style={[styles.container, { width: width - widthOffset }]}>
			<View style={[styles.titleContainer, tmid && styles.threadContainer]}>
				<ScrollView
					showsHorizontalScrollIndicator={false}
					horizontal
					bounces={false}
					contentContainerStyle={styles.scroll}
				>
					<Icon type={prid ? 'discussion' : type} status={status} />
					<HeaderTitle
						title={title}
						scale={scale}
						connecting={connecting}
					/>
				</ScrollView>
			</View>
			{type === 'thread' ? null : <Typing usersTyping={usersTyping} />}
		</TouchableOpacity>
	);
});

Header.propTypes = {
	title: PropTypes.string.isRequired,
	type: PropTypes.string.isRequired,
	width: PropTypes.number.isRequired,
	height: PropTypes.number.isRequired,
	prid: PropTypes.string,
	tmid: PropTypes.string,
	status: PropTypes.string,
	usersTyping: PropTypes.array,
	widthOffset: PropTypes.number,
	connecting: PropTypes.bool,
	goRoomActionsView: PropTypes.func
};

Header.defaultProps = {
	usersTyping: []
};

export default Header;

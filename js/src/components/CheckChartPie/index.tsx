import React from 'react'
import { Pie, measureTextWidth } from '@ant-design/plots'
import fakeData from '@/pages/Check/Chart/fakeData'
import type { IData } from '@/pages/Check/Chart/interface'

type IStyle = Record<string, number | string>

const CheckChartPie = () => {
	const copyFakeData = JSON.parse(JSON.stringify(fakeData))

	// sum the value if the type is 工廠1
	const data = copyFakeData.reduce((acc: IData[], cur: IData) => {
		const index = acc.findIndex((item) => item.type === cur.type)
		delete cur.month
		if (index === -1) {
			acc.push(cur)
		} else {
			acc[index].value += cur.value
		}

		return acc
	}, [])

	console.log('CheckChartPie', data)

	function renderStatistic(
		containerWidth: number,
		text: string,
		style: IStyle,
	) {
		const { width: textWidth, height: textHeight } = measureTextWidth(
			text,
			style,
		)
		const R = containerWidth / 2 // r^2 = (w / 2)^2 + (h - offsetY)^2

		let scale = 1

		if (containerWidth < textWidth) {
			scale = Math.min(
				Math.sqrt(
					Math.abs(
						Math.pow(R, 2) /
							(Math.pow(textWidth / 2, 2) + Math.pow(textHeight, 2)),
					),
				),
				1,
			)
		}

		const textStyleStr = `width:${containerWidth}px;`
		return `<div style="${textStyleStr};font-size:${scale}em;line-height:${
			scale < 1 ? 1 : 'inherit'
		};">${text}</div>`
	}

	const config = {
		appendPadding: 10,
		data,
		angleField: 'value',
		colorField: 'type',
		radius: 1,
		innerRadius: 0.64,
		meta: {
			value: {
				formatter: (v: number) => `${v} ¥`,
			},
		},
		label: {
			type: 'inner',
			offset: '-50%',
			style: {
				textAlign: 'center',
			},
			autoRotate: false,
			content: '{value}',
		},
		statistic: {
			title: {
				offsetY: -4,
				customHtml: (container: HTMLElement, _view: unknown, datum: any) => {
					console.log('@@@ datum', datum)

					const { width, height } = container.getBoundingClientRect()
					const d = Math.sqrt(Math.pow(width / 2, 2) + Math.pow(height / 2, 2))
					const text = datum ? datum.type : 'CO2排放量'
					return renderStatistic(d, text, {
						fontSize: 28,
					})
				},
			},
			content: {
				offsetY: 4,
				style: {
					fontSize: '24px',
				},
				customHtml: (
					container: HTMLElement,
					_view: unknown,
					datum: any,
					theData: any,
				) => {
					const { width } = container.getBoundingClientRect()
					const text = datum
						? `${datum.value}噸/年`
						: `${theData.reduce((r: number, d: IData) => r + d.value, 0)}噸/年`
					return renderStatistic(width, text, {
						fontSize: 16,
					})
				},
			},
		},
		// 添加 中心统计文本 交互
		interactions: [
			{
				type: 'element-selected',
			},
			{
				type: 'element-active',
			},
			{
				type: 'pie-statistic-active',
			},
		],
	}
	return <Pie {...config} />
}

export default CheckChartPie
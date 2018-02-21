const obj = {
	spread: 1,
	children: []
}

const size = 80
const dx = size / 2
const dy = size / 10
let draw = SVG('drawing').size('100%', '100vh')

// https://stackoverflow.com/questions/1484506/random-color-generator
const getRandomColor = () => {
	const letters = 'ABC3456789ABCDEF'
	let color = '#'
	for (let i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)]
	}
	return color
}

// オブジェクトからレンダリング　色は適当に作ってるから無視して
const render = () => {

	// 再帰的に子どもを辿って四角をレンダリングしていく
	const renderRecursive = (o, x, y) => {
		// 色はついてなかったら適当につけておく
		if (o.color === undefined) o.color = getRandomColor()

		const rect = draw.rect(size, size).move(x, y).fill(o.color).radius(size / 4)

		const text = draw.text(`spread: ${o.spread}`).move(x + 5, y + 5)

		// クリックしたらそのオブジェクトを吐き出す　デバッグ用
		rect.node.addEventListener('click', () => {
			// console.log(o)
			appendChild(o)
		})

		if (o.children.length !== 0) {

			let totalSpread = 0

			let num = 0

			for (let i = 0; i < o.children.length; i++) {
				const c = o.children[i]

				// 一個前のこどもの広がりを見て，初期生成位置を下にずらす量を追加
				if (i !== 0) totalSpread += o.children[i - 1].spread - 1

				// こどもを下に並べていく
				num = totalSpread + i

				renderRecursive(c, x + (size + dx), y + (size + dy) * num)
				draw
					.line(
						x + size, y + size / 2,
						x + (size + dx), y + (size + dy) * num + size / 2
					)
					.stroke({ width: 1 })
			}
		} else return
	}

	console.log('root', obj)

	renderRecursive(obj, 10, 10)
}

// 実行
render()

// DOMをリセットして，もう一度オブジェクトから生成する
const appendChild = base => {
	const makeObj = () => {
		return { spread: 1, parent: base, children: [], color: getRandomColor() }
	}
	// 再帰的に親を辿っていって広がりの値を更新
	const updateSpreadValueRecursive = o => {
		o.spread++
		if (o.parent !== undefined) updateSpreadValueRecursive(o.parent)
	}

	base.children.push(makeObj())

	if (base.children.length >= 2) updateSpreadValueRecursive(base)

	// clear dom
	document.querySelector('#drawing').textContent = ''

	draw = SVG('drawing').size('100%', '100vh')

	render()
}
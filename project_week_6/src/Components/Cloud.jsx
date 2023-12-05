/* eslint-disable react/prop-types */
import { Text } from "@visx/text";
import { scaleLog } from "@visx/scale";
import Wordcloud from "@visx/wordcloud/lib/Wordcloud";

const colors = ["#143059", "#2F6B9A", "#82a6c2"];

const fixedValueGenerator = () => 0.5;

// type SpiralType = 'archimedean' | 'rectangular';

export default function Cloud({ width, height, words, setSearch }) {
  const fontScale = scaleLog({
    domain: [
      Math.min(...words.map((w) => w.value)),
      Math.max(...words.map((w) => w.value)),
    ],
    range: [10, 100],
  });
  const fontSizeSetter = (datum) => fontScale(datum.value);

  const filterReviewOnClick = (search) => {
    setSearch(search);
  };

  return (
    <div className="wordcloud flex">
      <Wordcloud
        words={words}
        width={width}
        height={height}
        fontSize={fontSizeSetter}
        font={"Impact"}
        padding={2}
        spiral={"archimedean"}
        rotate={0}
        random={fixedValueGenerator}
      >
        {(cloudWords) =>
          cloudWords.map((w, i) => (
            <Text
              key={w.text}
              fill={colors[i % colors.length]}
              textAnchor={"middle"}
              transform={`translate(${w.x}, ${w.y}) rotate(${w.rotate})`}
              fontSize={w.size}
              fontFamily={w.font}
              onClick={() => {
                filterReviewOnClick(w.text);
              }}
              xlinkTitle="dsf"
            >
              {w.text}
            </Text>
          ))
        }
      </Wordcloud>
    </div>
  );
}

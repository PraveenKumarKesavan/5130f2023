/* eslint-disable react/prop-types */
import ParentSize from "@visx/responsive/lib/components/ParentSize";
import Cloud from "./Cloud";

const WordCloud = (props) => {
  const { words, setSearch, ourWords, setOurSearch } = props;
  return (
    <div className=" h-[40vh] w-full flex">
      <ParentSize>
        {({ width, height }) => (
          <Cloud
            words={words}
            width={width}
            height={height}
            setSearch={setSearch}
          />
        )}
      </ParentSize>
      <ParentSize>
        {({ width, height }) => (
          <Cloud
            words={ourWords}
            width={width}
            height={height}
            setSearch={setOurSearch}
          />
        )}
      </ParentSize>
    </div>
  );
};

export default WordCloud;

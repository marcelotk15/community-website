import React, { Suspense, Fragment } from 'react';
import styled, { css } from 'styled-components/macro';
import { Route, Switch, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Transition } from 'react-transition-group';
import { useScrollRestore } from 'hooks';
import { sectionPadding, rgba, AnimFade } from 'utils/style';
import { reflow } from 'utils/transition';
import Post from 'screens/Post';
import ProgressiveImage from 'components/ProgressiveImage';
import posts from 'posts';

function PostListItem({
  path,
  title,
  description,
  banner,
  bannerVideo,
  bannerPlaceholder,
  bannerAlt,
  date,
}) {
  return (
    <PostListItemWrapper>
      <PostContent to={`/articles${path}`}>
        <PostImageWrapper>
          <PostImage
            srcSet={banner ? require(`posts/assets/${banner}`) : undefined}
            videoSrc={bannerVideo ? require(`posts/assets/${bannerVideo}`) : undefined}
            placeholder={bannerPlaceholder ? require(`posts/assets/${bannerPlaceholder}`) : undefined}
            alt={bannerAlt}
          />
          <PostImageTag>K256</PostImageTag>
        </PostImageWrapper>
        <PostText>
          <PostDate>
            {new Date(date).toLocaleDateString('default', { year: 'numeric', month: 'long' })}
          </PostDate>
          <PostTitle>{title}</PostTitle>
          <PostDescription>{description}</PostDescription>
        </PostText>
      </PostContent>
    </PostListItemWrapper>
  );
}

function PostList(props) {
  const { id, sectionRef, visible = true, ...rest } = props;
  const title = `${id}-title`;
  useScrollRestore();

  return (
    <PostListWrapper
      id={id}
      ref={sectionRef}
      aria-labelledby={title}
      {...rest}
    >
      {!sectionRef &&
        <Helmet>
          <title>{`Articles | Death's Shadow`}</title>
          <meta name="description" content="A collection of strategic guides and primer articles." />
        </Helmet>
      }
      <Transition
        in={visible}
        timeout={0}
        onEnter={reflow}
      >
        {status => (
          <PostListContent status={status}>
            <PostTitleWrapper>
              <PostListTitle id={title}>Articles</PostListTitle>
            </PostTitleWrapper>
            <PostListColumn>
              {posts.map(({ path, ...post }) =>
                <PostListItem key={path} path={path} {...post} />
              )}
            </PostListColumn>
          </PostListContent>
        )}
      </Transition>
    </PostListWrapper>
  );
}

export default function Articles(props) {
  return (
    <Post>
      <Suspense fallback={Fragment}>
        <Switch>
          {posts.map(({ content: PostComp, path, ...rest }) => (
            <Route
              key={path}
              path={`/articles${path}`}
              render={() => <PostComp {...rest} />}
            />
          ))}
          <Route render={() => <PostList {...props} />} />
        </Switch>
      </Suspense>
    </Post>
  );
}

const PostListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PostListContent = styled.div`
  max-width: ${props => props.theme.maxWidthDesktop}px;
  width: 100%;
  display: grid;
  grid-template-columns: 144px 1fr;
  grid-gap: 20px;
  padding: 80px 0;
  position: relative;
  opacity: 0;

  @media (max-width: ${props => props.theme.laptop}px) {
    max-width: ${props => props.theme.maxWidthLaptop}px;
  }

  @media (max-width: ${props => props.theme.mobile}px) {
    padding-top: 100px;
  }

  ${props => props.status === 'entering' && css`
    animation: ${css`${AnimFade} 0.6s ease 0.2s forwards`};
  `}

  ${props => props.status === 'entered' && css`
    opacity: 1;
  `}
`;

const PostListItemWrapper = styled.article`
  display: flex;
  justify-content: center;
  ${sectionPadding}
`;

const PostTitleWrapper = styled.div`
  display: flex;
  align-items: flex-start;
`;

const PostListColumn = styled.div`
  display: grid;
  grid-template-columns: 100%;
  grid-gap: 60px;
`;

const PostListTitle = styled.h1`
  font-size: 120px;
  margin: 0;
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  position: relative;
`;

const PostContent = styled(Link)`
  width: 100%;
  display: grid;
  grid-template-columns: 300px 1fr;
  grid-gap: 0 40px;
  text-decoration: none;
  transition: background-color 0.4s ease;

  @media (max-width: ${props => props.theme.tablet}px) {
    grid-template-columns: 100%;
    max-width: 440px;
  }
`;

const PostText = styled.div`
  grid-column: 2;
  padding: 60px 0;

  @media (max-width: ${props => props.theme.tablet}px) {
    grid-column: 1;
    padding: 30px 0;
  }
`;

const PostDate = styled.span`
  display: block;
  margin-bottom: 8px;
  color: ${props => rgba(props.theme.colorText, 0.6)};
`;

const PostTitle = styled.h2`
  margin: 0;
  font-size: 36px;
  font-weight: 500;
  line-height: 1.2;
  color: ${props => props.theme.colorTitle};
  display: inline;
  background: linear-gradient(${props => rgba(props.theme.colorText, 1)}, ${props => rgba(props.theme.colorText, 1)}) no-repeat 100% 100% / 0 2px;
  transition: background-size 0.4s ${props => props.theme.curveFastoutSlowin};
  padding-bottom: 2px;

  &:hover,
  &:focus {
    background: linear-gradient(${props => rgba(props.theme.colorText, 1)}, ${props => rgba(props.theme.colorText, 1)}) no-repeat 0 100% / 100% 2px;
  }

  @media (max-width: ${props => props.theme.mobile}px) {
    font-size: 30px;
  }
`;

const PostDescription = styled.p`
  font-size: 20px;
  line-height: 1.5;
  color: ${props => props.theme.colorText};
  margin: 20px 0 0;

  @media (max-width: ${props => props.theme.mobile}px) {
    font-size: 18px;
  }
`;

const PostImage = styled(ProgressiveImage)`
  height: 100%;
  clip-path: polygon(0 0, 100% 0, 100% 100%, 70% 100%, 70% calc(100% - 14px), calc(70% - 60px) calc(100% - 14px), calc(70% - 60px) 100%, 28px 100%, 0 calc(100% - 28px));

  img,
  video {
    height: 100%;
    width: 100%;
    object-fit: cover;
    transition: transform 0.5s ${props => props.theme.curveFastoutSlowin};
  }

  ${/* sc-selector */PostContent}:hover & img,
  ${/* sc-selector */PostContent}:hover & video {
    transform: scale3d(1.1, 1.1, 1);
  }
`;

const PostImageWrapper = styled.div`
  position: relative;
`;

const PostImageTag = styled.div`
  position: absolute;
  bottom: -10px;
  left: calc(70% - 60px);
  padding: 0 10px;
  text-align: center;
  width: 60px;
  font-size: 14px;
  font-weight: 500;
  color: ${props => rgba(props.theme.colorText, 0.6)};
`;

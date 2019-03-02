import STYLES from './index.styl'
import React from 'react'
import Card, { CardActions, CardBlock, CardDivider, CardFooter, CardImage, CardTitle } from 'mineral-ui/Card'
import Button from 'mineral-ui/Button'

export const Movie = ({title, posterUrl, genres, onClick}) => {
    return (
        <Card className={STYLES.card} onClick={onClick}>
            <CardImage className={STYLES.poster} src={posterUrl} />
            <CardTitle>{title}</CardTitle>
            <CardBlock>Some quick example text to build on the card title and make up the bulk of
                the card's content.
            </CardBlock>
            <CardDivider/>
            <CardBlock>
                {genres}
            </CardBlock>
            {/* <CardActions>
                <Button primary>Button 1</Button>
            </CardActions> */}
            {/* <CardFooter title={genres}/> */}
        </Card>
    )
}

export default Movie
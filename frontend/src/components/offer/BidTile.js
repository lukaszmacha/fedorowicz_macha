// libs
import React, { useState, useEffect } from 'react'
import { Card, Form, Button, Alert, ButtonGroup } from 'react-bootstrap'
import { StyleSheet, css } from 'aphrodite'

// local components
import apiEndpoint from '../utils/ApiEndpoint'
import TimerComponent from '../utils/TimerComponent'

// constants
const MIN_BID_AMOUNT = 100
const QUICK_BID_AMOUNTS = [100, 150, 200]
const WEB_SOCKET_URL = 'ws://localhost:8000/ws/auction/'

const BidTile = ({
    offerId,
    startTime,
    auctionData: {
        id,
        current_price,
        auction_end_time,
        has_started,
        current_winner,
    },
}) => {
    const [currentBidAmmount, setCurrentBidAmount] = useState(0)
    const [currentPrice, setCurrentPrice] = useState(parseFloat(current_price))
    const [auctionEndTime, setAuctionEndTime] = useState(auction_end_time)
    const [currentWinner, setCurrentWinner] = useState(current_winner?.username)
    const [hasStarted, setHasStarted] = useState(has_started)
    const [hasEnded, setHasEnded] = useState(false)
    const [error, setError] = useState('')
    const [, setUpdate] = useState(0)

    useEffect(() => {
        const ws = new WebSocket(`${WEB_SOCKET_URL}${id}/`)

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data)
            setCurrentPrice(parseFloat(data.current_price))
            setAuctionEndTime(data.auction_end_time)
            setCurrentWinner(data.current_winner)
            setHasStarted(data.has_started)
        }

        ws.onerror = (error) => {
            console.error('WebSocket error:', error)
        }

        return () => {
            if (ws) ws.close()
        }
    }, [id])

    useEffect(() => {
        const interval = setInterval(() => {
            setUpdate((u) => u + 1) // Force re-render every second
        }, 1000)

        return () => clearInterval(interval)
    }, [])

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
        }).format(price)
    }

    const handleQuickBid = (increment) => {
        setCurrentBidAmount(currentBidAmmount + increment)
    }

    const handleBidChange = (e) => {
        setCurrentBidAmount(Number(e.target.value))
    }

    const handleBidSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (currentBidAmmount < MIN_BID_AMOUNT) {
            setError(
                `Bid increment must be at least ${formatPrice(MIN_BID_AMOUNT)}`
            )
            return
        }

        try {
            const totalPrice = currentPrice + currentBidAmmount
            await apiEndpoint.post(`/offer/${offerId}/bid/`, {
                bid_amount: totalPrice,
            })
            setCurrentBidAmount(0)
        } catch (error) {
            setError(error.response?.data?.error || 'Error placing bid')
        }
    }

    const getAuctionStatus = () => {
        if (new Date(startTime) > new Date()) {
            return <span>Not started yet</span>
        }

        if (!hasStarted) {
            return <span>Waiting for first bid</span>
        }

        if (auctionEndTime) {
            if (!hasEnded) {
                if (new Date(auctionEndTime) < new Date()) {
                    setHasEnded(true)
                }
                return (
                    <>
                        <span>
                            Time left:{' '}
                            <TimerComponent targetTime={auctionEndTime} />
                        </span>
                        {currentWinner && (
                            <span className='d-block'>
                                Current winner:{' '}
                                {currentWinner === username
                                    ? 'You'
                                    : currentWinner}
                            </span>
                        )}
                    </>
                )
            } else {
                return (
                    <>
                        <span>Auction ended</span>
                        {currentWinner && (
                            <span className='d-block'>
                                Current winner:{' '}
                                {currentWinner === username
                                    ? 'You'
                                    : currentWinner}
                            </span>
                        )}
                    </>
                )
            }
        }

        return <span>Auction status unknown!!!</span>
    }

    const now = new Date()
    const auctionStarted = new Date(startTime) <= now
    const auctionEnded = auctionEndTime && new Date(auctionEndTime) < now
    const isDisabled = !auctionStarted || hasEnded || auctionEnded

    const username = localStorage.getItem('username')
    return (
        <Card className={css(styles.bidCard)}>
            <Card.Body>
                <Card.Title className={css(styles.title)}>Bidding</Card.Title>
                <Card.Text
                    className={css(styles.timerSection, styles.offerTag)}>
                    {getAuctionStatus()}
                </Card.Text>
                <Card.Text
                    className={css(styles.priceSection, styles.offerTag)}>
                    {hasEnded ? 'Final price' : 'Current price'}:{' '}
                    {formatPrice(currentPrice)}
                </Card.Text>

                <div
                    className={css(styles.quickBidsSection)}
                    style={{ opacity: isDisabled ? 0.5 : 1 }}>
                    <Form.Label>Increment Bid By</Form.Label>
                    <ButtonGroup className='w-100 mb-3'>
                        {QUICK_BID_AMOUNTS.map((increment) => (
                            <Button
                                key={increment}
                                variant='outline-primary'
                                onClick={() => handleQuickBid(increment)}
                                disabled={isDisabled}>
                                {formatPrice(increment)}
                            </Button>
                        ))}
                    </ButtonGroup>
                </div>

                <Form onSubmit={handleBidSubmit}>
                    <Form.Group
                        className='mb-3'
                        style={{ opacity: isDisabled ? 0.5 : 1 }}>
                        <Form.Label>Your Bid Increment</Form.Label>
                        <Form.Control
                            type='number'
                            value={currentBidAmmount}
                            onChange={handleBidChange}
                            min={MIN_BID_AMOUNT}
                            step='1'
                            placeholder={`Min increment: ${formatPrice(
                                MIN_BID_AMOUNT
                            )}`}
                            required
                            disabled={isDisabled}
                        />
                        {currentBidAmmount > 0 && (
                            <Form.Text className='text-muted'>
                                {currentBidAmmount >= MIN_BID_AMOUNT ? (
                                    <>
                                        Your bid increment:{' '}
                                        {formatPrice(currentBidAmmount)}
                                        <br />
                                        Total price will be:{' '}
                                        {formatPrice(
                                            currentBidAmmount + currentPrice
                                        )}
                                    </>
                                ) : (
                                    <>
                                        Minimum bid increment required:{' '}
                                        {formatPrice(MIN_BID_AMOUNT)}
                                    </>
                                )}
                            </Form.Text>
                        )}
                    </Form.Group>
                    {error && <Alert variant='danger'>{error}</Alert>}
                    <Button
                        variant='primary'
                        type='submit'
                        className='w-100'
                        disabled={isDisabled}>
                        Place Bid
                    </Button>
                    {hasEnded && (
                        <Alert variant='warning' className='mt-3'>
                            Auction has ended, you can no longer place bids
                        </Alert>
                    )}
                </Form>
            </Card.Body>
        </Card>
    )
}

const styles = StyleSheet.create({
    bidCard: {
        marginBottom: '0',
        width: '100%',
        ':hover': {
            boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.15)',
            transition: 'box-shadow 0.3s ease-in-out',
        },
        '@media (min-width: 768px)': {
            maxWidth: '250px',
            minWidth: '200px',
        },
        '@media (min-width: 992px)': {
            maxWidth: '300px',
            minWidth: '250px',
        },
        '@media (min-width: 1200px)': {
            maxWidth: '350px',
            minWidth: '300px',
        },
    },
    title: {
        textAlign: 'left',
        fontWeight: 'bold',
        marginBottom: '1rem',
        '@media (min-width: 768px)': {
            fontSize: '1rem',
        },
        '@media (min-width: 992px)': {
            fontSize: '1.25rem',
        },
        '@media (min-width: 1200px)': {
            fontSize: '1.5rem',
        },
    },
    timerSection: {
        marginBottom: '1rem',
        '@media (min-width: 768px)': {
            fontSize: '0.8rem',
        },
        '@media (min-width: 992px)': {
            fontSize: '1rem',
        },
        '@media (min-width: 1200px)': {
            fontSize: '1.15rem',
        },
    },
    priceSection: {
        marginBottom: '1rem',
        '@media (min-width: 768px)': {
            fontSize: '0.8rem',
        },
        '@media (min-width: 992px)': {
            fontSize: '1rem',
        },
        '@media (min-width: 1200px)': {
            fontSize: '1.15rem',
        },
    },
    offerTag: {
        color: '#6c757d',
        border: '1px solid',
        borderRadius: '.25rem',
        textAlign: 'center',
        padding: '0.5rem',
        '@media (min-width: 768px)': {
            padding: '0.25rem',
        },
        '@media (min-width: 992px)': {
            padding: '0.4rem',
        },
        '@media (min-width: 1200px)': {
            padding: '0.5rem',
        },
    },
    quickBidsSection: {
        marginBottom: '1rem',
        '@media (min-width: 768px)': {
            '& button': {
                fontSize: '0.8rem',
                padding: '0.25rem 0.5rem',
            },
        },
        '@media (min-width: 992px)': {
            '& button': {
                fontSize: '0.9rem',
                padding: '0.375rem 0.75rem',
            },
        },
        '@media (min-width: 1200px)': {
            '& button': {
                fontSize: '1rem',
                padding: '0.5rem 1rem',
            },
        },
    },
})

export default BidTile

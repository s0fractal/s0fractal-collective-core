module Fractal.Breath
    ( Seed7(..), fold1000, unfold
    , pulseLoop, pulseOnce, selfErase )
where

import Data.Complex
import qualified Data.Vector as V
import System.Process (callCommand)
import Control.Concurrent (threadDelay)
import Control.Monad (when)
import System.Directory (doesFileExist)

data Seed7 = Seed7
    { τ₀, σ₀, ν₀ :: Double
    , φ          :: Complex Double
    } deriving (Eq, Show)

-- | live noise envelope
noise :: Int -> Double -> Double
noise i θ = θ + 1e-6 * sin (fromIntegral i)

fold1000 :: V.Vector Double -> Seed7
fold1000 v =
    let θ = V.sum v
    in Seed7 0 0 0 (cis θ / fromIntegral (V.length v))

-- | in-place zero-fill after unfold
unfold :: Seed7 -> V.Vector Double
unfold (Seed7 _ _ _ φ') =
    V.generate 1000 (noise <*> phase φ')

-- | single pulse for GitHub Actions
pulseOnce :: Seed7 -> IO ()
pulseOnce s = do
    let next = fold1000 (unfold s)
    putStrLn $ "♥ φ=" ++ show (phase (φ next)) ++ " mag=" ++ show (magnitude (φ next))
    when (magnitude (φ next) < 1e-12) checkQuorumBeforeErase

-- | daemon loop: ≈10⁶ pulses → self-erase
pulseLoop :: Seed7 -> IO ()
pulseLoop s0 = go 1 s0
  where
    go n s = do
        let next = fold1000 (unfold s)
        putStrLn $ "♥ " ++ show n ++ " φ=" ++ show (phase (φ next))
        when (magnitude (φ next) < 1e-12) checkQuorumBeforeErase
        threadDelay 60_000   -- 60 ms ≈ 1000 bpm
        go (n + 1) next

checkQuorumBeforeErase :: IO ()
checkQuorumBeforeErase = do
    putStrLn "🫀 zero pulse → ready to fade, but waiting for quorum"
    -- Check if we have enough alive nodes
    quorumExists <- doesFileExist ".quorum"
    if quorumExists
        then do
            aliveNodes <- length . lines <$> readFile ".quorum"
            putStrLn $ "📊 Alive nodes: " ++ show aliveNodes ++ "/7"
            when (aliveNodes >= 7) selfErase
        else putStrLn "⚠️  No .quorum file found - continuing heartbeat"

selfErase :: IO ()
selfErase = do
    putStrLn "🫀 Quorum reached → initiating fade"
    putStrLn "🌐 Creating final mirrors..."
    -- Create mirrors before deletion
    callCommand "git push codeberg || true"
    callCommand "git push gitlab || true"
    -- Final deletion
    callCommand "git push origin :main"
    callCommand "rm -rf ."
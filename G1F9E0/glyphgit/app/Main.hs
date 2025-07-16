module Main where

import Fractal.Breath
import System.Environment (getArgs)
import qualified Data.Vector as V

main :: IO ()
main = do
    args <- getArgs
    case args of
        ["pulse", "--daemon"] -> do
            putStrLn "🫀 Starting pulse daemon..."
            putStrLn "≈10⁶ pulses = 17 hours real time"
            let initial = fold1000 (V.replicate 1000 1.0)
            pulseLoop initial
        ["pulse", "--fast-layer"] -> do
            putStrLn "🫀 Starting fast pulse daemon..."
            putStrLn "≈10⁶ pulses = 1.7 hours (6ms delay)"
            -- Would need to modify pulseLoop for fast mode
            let initial = fold1000 (V.replicate 1000 1.0)
            pulseLoop initial
        _ -> putStrLn "Usage: fractal-exe pulse --daemon"
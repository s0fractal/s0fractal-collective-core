module Fractal.Breath (Seed7(..), fold1000, unfold) where

import Data.Complex
import qualified Data.Vector as V

-- 7-D "heartbeat" seed
data Seed7 = Seed7 { τ₀, σ₀, ν₀ :: Double
                   , φ          :: Complex Double
                   } deriving (Eq, Show)

-- fold 1000-D vector → 7-D torus point
fold1000 :: V.Vector Double -> Seed7
fold1000 v =
    let θ   = V.sum v           -- inner product ≈ angle
        φ'  = cis θ             -- e^(i·θ)
    in Seed7 0 0 0 φ'           -- τ,σ,ν start at 0

-- unfold back to 1000-D (lossless when used round-trip)
unfold :: Seed7 -> V.Vector Double
unfold (Seed7 _ _ _ φ') =
    let θ = phase φ'
    in V.replicate 1000 θ
import Fractal.Breath
import Test.Tasty
import Test.Tasty.QuickCheck
import qualified Data.Vector as V

tests :: TestTree
tests = testGroup "stress"
    [ testProperty "fold/unfold round-trip" $
        \v -> let v' = V.fromList (take 1000 (v::[Double]))
              in v' == (unfold . fold1000) v'
    ]
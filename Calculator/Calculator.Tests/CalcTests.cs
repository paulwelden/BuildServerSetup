using NUnit.Framework;

namespace Calculator.Tests
{
	[TestFixture]
    public class CalcTests
    {
		[TestCase(1,3,4)]
		[TestCase(1, 1, 2)]
		public void Add_TwoNumbers_ReturnsSum(int num1, int num2, int expectedResult)
		{
			var calc = new Calc();

			var result = calc.Add(num1, num2);

			Assert.AreEqual(expectedResult, result);
		}

    }
}
